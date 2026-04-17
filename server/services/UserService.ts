import bcrypt from 'bcrypt'
import { IRegisterInput } from '../interfaces/IRegisterInput'
import { User } from '../models/User'
import { Database } from '../database'

// Service class handling user-related business logic
export class UserService {
  private database: Database

  public constructor() {
    // Initialize database connection
    this.database = new Database()
  }

  // Handle new user registration
  public async register(data: IRegisterInput): Promise<User> {
    const { username, password } = data

    // Validate required fields
    if (!username || !password) {
      throw new Error('Benutzername und Passwort sind erforderlich')
    }

    const trimmedUsername = username.trim()

    // Validate username length
    if (trimmedUsername.length < 3) {
      throw new Error('Benutzername muss mind. 3 Zeichen lang sein')
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Passwort muss mind. 6 Zeichen lang sein')
    }

    // Check if username already exists in database
    const existingUsers = await this.database.executeSQL(
      `SELECT * FROM users WHERE username = '${trimmedUsername}'`
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error('Benutzername ist bereits vergeben')
    }

    // Hash password and format current timestamp
    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // Insert new user record into database
    await this.database.executeSQL(`
      INSERT INTO users (username, passwordHash, role, isBlocked, createdAt, updatedAt)
      VALUES ('${trimmedUsername}', '${passwordHash}', 'USER', false, '${now}', '${now}')
    `)

    // Return new User object
    const user = new User(trimmedUsername, passwordHash, 'USER', false)
    return user
  }

  // Handle user authentication
  public async login(username: string, password: string): Promise<User> {
    // Validate credentials input
    if (!username || !password) {
      throw new Error('Benutzername und Passwort sind erforderlich')
    }

    const trimmedUsername = username.trim()

    // Retrieve user from database by username
    const result = await this.database.executeSQL(
      `SELECT * FROM users WHERE username = '${trimmedUsername}'`
    )

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error('Benutzer nicht gefunden')
    }

    const dbUser = result[0]

    // Verify password against stored hash
    const passwordMatches = await bcrypt.compare(password, dbUser.passwordHash)

    if (!passwordMatches) {
      throw new Error('Falsches Passwort')
    }

    // Map database result to User model instance
    const user = new User(
      dbUser.username,
      dbUser.passwordHash,
      dbUser.role,
      Boolean(dbUser.isBlocked)
    )

    user.id = dbUser.id

    return user
  }
}
