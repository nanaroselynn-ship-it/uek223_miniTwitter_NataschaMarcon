import { Database } from '../database'
import { ICreateReactionInput } from '../interfaces/ICreateReactionInput'
import { Reaction } from '../models/Reaction'

// Service class managing post reactions (likes/dislikes)
export class ReactionService {
  private database: Database

  public constructor() {
    // Initialize database connection
    this.database = new Database()
  }

  // Persist a new reaction in the database
  public async createReaction(data: ICreateReactionInput): Promise<Reaction> {
    const { type, userId, postId } = data

    // Validate that all required fields are present
    if (!type || !userId || !postId) {
      throw new Error('type, userId und postId sind erforderlich')
    }

    // Ensure the reaction type is valid
    if (type !== 'LIKE' && type !== 'DISLIKE') {
      throw new Error('Type muss LIKE oder DISLIKE sein')
    }

    // Execute SQL to insert the reaction record
    await this.database.executeSQL(`
      INSERT INTO reactions (type, userId, postId)
      VALUES ('${type}', ${userId}, ${postId})
    `)

    // Return a new Reaction model instance
    return new Reaction(type, userId, postId)
  }
}
