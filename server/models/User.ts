// Model class representing a User entity
export class User {
  public id?: number
  public username: string
  private passwordHash: string
  public role: string
  public isBlocked: boolean

  public constructor(
    username: string,
    passwordHash: string,
    role: string = 'USER',
    isBlocked: boolean = false
  ) {
    this.username = username
    this.passwordHash = passwordHash
    this.role = role
    this.isBlocked = isBlocked
  }

  // Getter for the private password hash
  public getPasswordHash(): string {
    return this.passwordHash
  }

  // Setter to update the private password hash
  public setPasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash
  }
}
