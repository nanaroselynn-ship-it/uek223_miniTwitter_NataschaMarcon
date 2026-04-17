import { Database } from '../database'
import { ICreateCommentInput } from '../interfaces/ICreateCommentInput'
import { Comment } from '../models/Comments'

// Service class for managing post comments
export class CommentService {
  private database: Database

  public constructor() {
    // Initialize database connection
    this.database = new Database()
  }

  // Create and persist a new comment
  public async createComment(data: ICreateCommentInput): Promise<Comment> {
    const { content, authorId, postId } = data

    // Validate required fields
    if (!content || !authorId || !postId) {
      throw new Error('Inhalt, authorId und postId sind erforderlich')
    }

    const trimmedContent = content.trim()

    // Prevent empty comments
    if (trimmedContent.length === 0) {
      throw new Error('Kommentar darf nicht leer sein')
    }

    // Format current timestamp for SQL
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // Insert comment into the database
    await this.database.executeSQL(`
      INSERT INTO comments (content, createdAt, updatedAt, authorId, postId)
      VALUES ('${trimmedContent}', '${now}', '${now}', ${authorId}, ${postId})
    `)

    return new Comment(trimmedContent, authorId, postId)
  }

  // Update the text of an existing comment
  public async updateComment(id: number, content: string): Promise<void> {
    if (!content) {
      throw new Error('Inhalt ist erforderlich')
    }

    const trimmedContent = content.trim()

    if (trimmedContent.length === 0) {
      throw new Error('Kommentar darf nicht leer sein')
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // Update content and timestamp in database
    await this.database.executeSQL(`
      UPDATE comments
      SET content = '${trimmedContent}', updatedAt = '${now}'
      WHERE id = ${id}
    `)
  }

  // Retrieve all comments associated with a specific post
  public async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const result = await this.database.executeSQL(`
      SELECT * FROM comments
      WHERE postId = ${postId}
      ORDER BY createdAt DESC
    `)

    if (!Array.isArray(result)) {
      return []
    }

    // Map database rows to Comment model instances
    return result.map((row: any) => {
      const comment = new Comment(row.content, row.authorId, row.postId)
      comment.id = row.id
      comment.createdAt = row.createdAt
      comment.updatedAt = row.updatedAt
      return comment
    })
  }

  // Fetch a single comment by its ID
  public async getCommentById(id: number): Promise<any | null> {
    const result = await this.database.executeSQL(`
      SELECT * FROM comments
      WHERE id = ${id}
      LIMIT 1
    `)

    if (!Array.isArray(result) || result.length === 0) {
      return null
    }

    return result[0]
  }

  // Delete a comment if the user has sufficient permissions
  public async deleteComment(id: number, userId: number, userRole: string): Promise<void> {
    const comment = await this.getCommentById(id)

    if (!comment) {
      throw new Error('Kommentar nicht gefunden')
    }

    // Check ownership or administrative roles
    const isOwner = comment.authorId === userId
    const isModerator = userRole === 'MODERATOR'
    const isAdmin = userRole === 'ADMIN'

    if (!isOwner && !isModerator && !isAdmin) {
      throw new Error('Keine Berechtigung zum Löschen dieses Kommentars')
    }

    // Execute deletion from database
    await this.database.executeSQL(`
      DELETE FROM comments
      WHERE id = ${id}
    `)
  }
}
