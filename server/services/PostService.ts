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

  public async getAllPosts(): Promise<any[]> {
    const result = await this.database.executeSQL(`
      SELECT 
        p.*,
        COALESCE(SUM(CASE WHEN r.type = 'LIKE' THEN 1 ELSE 0 END), 0) AS likeCount,
        COALESCE(SUM(CASE WHEN r.type = 'DISLIKE' THEN 1 ELSE 0 END), 0) AS dislikeCount
      FROM posts p
      LEFT JOIN reactions r ON p.id = r.postId
      GROUP BY p.id
      ORDER BY p.createdAt DESC
    `)

    return Array.isArray(result) ? result : []
  }

  public async getPostById(id: number): Promise<any | null> {
    const result = await this.database.executeSQL(`
      SELECT * FROM posts
      WHERE id = ${id}
      LIMIT 1
    `)

    if (!Array.isArray(result) || result.length === 0) {
      return null
    }

    return result[0]
  }

  public async updatePost(id: number, content: string): Promise<void> {
    if (!content) {
      throw new Error('Inhalt ist erforderlich')
    }

    const trimmedContent = content.trim()

    if (trimmedContent.length === 0) {
      throw new Error('Beitrag darf nicht leer sein')
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await this.database.executeSQL(`
      UPDATE posts
      SET content = '${trimmedContent}', updatedAt = '${now}'
      WHERE id = ${id}
    `)
  }

  public async deletePost(id: number, userId: number, userRole: string): Promise<void> {
    const post = await this.getPostById(id)

    if (!post) {
      throw new Error('Beitrag nicht gefunden')
    }

    const isOwner = post.authorId === userId
    const isModerator = userRole === 'MODERATOR'
    const isAdmin = userRole === 'ADMIN'

    if (!isOwner && !isModerator && !isAdmin) {
      throw new Error('Keine Berechtigung zum Löschen dieses Beitrags')
    }

    await this.database.executeSQL(`
      DELETE FROM comments
      WHERE postId = ${id}
    `)

    await this.database.executeSQL(`
      DELETE FROM reactions
      WHERE postId = ${id}
    `)

    await this.database.executeSQL(`
      DELETE FROM posts
      WHERE id = ${id}
    `)
  }
}