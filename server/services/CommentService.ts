import { Database } from '../database'
import { ICreateCommentInput } from '../interfaces/ICreateCommentInput'
import { Comment } from '../models/Comments'

export class CommentService {
  private database: Database

  public constructor() {
    this.database = new Database()
  }

  public async createComment(data: ICreateCommentInput): Promise<Comment> {
    const { content, authorId, postId } = data

    if (!content || !authorId || !postId) {
      throw new Error('Inhalt, authorId und postId sind erforderlich')
    }

    const trimmedContent = content.trim()

    if (trimmedContent.length === 0) {
      throw new Error('Kommentar darf nicht leer sein')
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await this.database.executeSQL(`
      INSERT INTO comments (content, createdAt, updatedAt, authorId, postId)
      VALUES ('${trimmedContent}', '${now}', '${now}', ${authorId}, ${postId})
    `)

    return new Comment(trimmedContent, authorId, postId)
  }

  public async updateComment(id: number, content: string): Promise<void> {
    if (!content) {
      throw new Error('Inhalt ist erforderlich')
    }

    const trimmedContent = content.trim()

    if (trimmedContent.length === 0) {
      throw new Error('Kommentar darf nicht leer sein')
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await this.database.executeSQL(`
      UPDATE comments
      SET content = '${trimmedContent}', updatedAt = '${now}'
      WHERE id = ${id}
    `)
  }

  public async deleteComment(id: number): Promise<void> {
    await this.database.executeSQL(`
      DELETE FROM comments
      WHERE id = ${id}
    `)
  }

  public async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const result = await this.database.executeSQL(`
      SELECT * FROM comments
      WHERE postId = ${postId}
      ORDER BY createdAt DESC
    `)

    if (!Array.isArray(result)) {
      return []
    }

    return result.map((row: any) => {
      const comment = new Comment(row.content, row.authorId, row.postId)
      comment.id = row.id
      comment.createdAt = row.createdAt
      comment.updatedAt = row.updatedAt
      return comment
    })
  }
}