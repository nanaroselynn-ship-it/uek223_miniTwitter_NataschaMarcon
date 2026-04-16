import * as mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, POST_TABLE, COMMENT_TABLE, REACTION_TABLE } from './schema'

export class Database {
  private _pool: Pool

  constructor() {
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })

    this.initializeDBSchema()
  }

  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')

    try {
      await this.executeSQL(USER_TABLE)
      await this.executeSQL(POST_TABLE)
      await this.executeSQL(COMMENT_TABLE)
      await this.executeSQL(REACTION_TABLE)

      console.log('Alle Tabellen wurden erfolgreich erstellt oder existieren bereits!')
    } catch (err) {
      console.error('Fehler bei der Schema-Initialisierung:', err)
    }
  }

  public executeSQL = async (query: string) => {
    let conn

    try {
      conn = await this._pool.getConnection()
      const res = await conn.query(query)
      return res
    } catch (err) {
      console.log('SQL Fehler:', err)
      throw err   
    } finally {
      if (conn) conn.end()
    }
  }
}