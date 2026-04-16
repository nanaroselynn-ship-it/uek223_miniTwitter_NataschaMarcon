import { Database } from '../database'
import { ICreatePostInput } from '../interfaces/ICreatePostInput'
import { Post } from '../models/Post'

export class PostService {
  private database: Database

  public constructor() {
    this.database = new Database()
  }

  public async createPost(data: ICreatePostInput): Promise<Post> {
    const { content, authorId } = data

    if (!content || !authorId) {
      throw new Error('Inhalt und authorId sind erforderlich')
    }

    const trimmedContent = content.trim()

    if (trimmedContent.length === 0) {
      throw new Error('Beitrag darf nicht leer sein')
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await this.database.executeSQL(`
      INSERT INTO posts (content, createdAt, updatedAt, authorId)
      VALUES ('${trimmedContent}', '${now}', '${now}', ${authorId})
    `)

    return new Post(trimmedContent, authorId)
  }

  public async getAllPosts(): Promise<Post[]> {
    const result = await this.database.executeSQL(`
      SELECT * FROM posts
      ORDER BY createdAt DESC
    `)

    if (!Array.isArray(result)) {
      return []
    }

    return result.map((row: any) => {
      const post = new Post(row.content, row.authorId)
      post.id = row.id
      post.createdAt = row.createdAt
      post.updatedAt = row.updatedAt
      return post
    })
  }
}