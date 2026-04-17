import * as mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, POST_TABLE, COMMENT_TABLE, REACTION_TABLE } from './schema'

// Class to manage MariaDB connections and schema setup
export class Database {
  private _pool: Pool

  constructor() {
    // Create a connection pool using environment variables or default values
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })

    // Automatically trigger schema initialization on startup
    this.initializeDBSchema()
  }

  // Helper method to create all required database tables
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')

    try {
      // Execute table creation scripts sequentially
      await this.executeSQL(USER_TABLE)
      await this.executeSQL(POST_TABLE)
      await this.executeSQL(COMMENT_TABLE)
      await this.executeSQL(REACTION_TABLE)

      console.log('Alle Tabellen wurden erfolgreich erstellt oder existieren bereits!')
    } catch (err) {
      console.error('Fehler bei der Schema-Initialisierung:', err)
    }
  }

  // General method to acquire a connection and execute SQL queries
  public executeSQL = async (query: string) => {
    let conn

    try {
      // Get connection from pool and run query
      conn = await this._pool.getConnection()
      const res = await conn.query(query)
      return res
    } catch (err) {
      console.log('SQL Fehler:', err)
      throw err   
    } finally {
      // Ensure connection is released back to the pool
      if (conn) conn.end()
    }
  }
}
