import bcrypt from 'bcrypt'
import { IRegisterInput } from '../interfaces/IRegisterInput'
import { User } from '../models/User'
import { Database } from '../database'

export class UserService {
  private database: Database

  public constructor() {
    this.database = new Database()
  }

  public async register(data: IRegisterInput): Promise<User> {
    const { username, password } = data

    if (!username || !password) {
      throw new Error('Benutzername und Passwort sind erforderlich')
    }

    const trimmedUsername = username.trim()

    if (trimmedUsername.length < 3) {
      throw new Error('Benutzername muss mind. 3 Zeichen lang sein')
    }

    if (password.length < 6) {
      throw new Error('Passwort muss mind. 6 Zeichen lang sein')
    }

    const existingUsers = await this.database.executeSQL(
      `SELECT * FROM users WHERE username = '${trimmedUsername}'`
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error('Benutzername ist bereits vergeben')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await this.database.executeSQL(`
      INSERT INTO users (username, passwordHash, role, isBlocked, createdAt, updatedAt)
      VALUES ('${trimmedUsername}', '${passwordHash}', 'USER', false, '${now}', '${now}')
    `)

    const user = new User(trimmedUsername, passwordHash, 'USER', false)
    return user
  }
}