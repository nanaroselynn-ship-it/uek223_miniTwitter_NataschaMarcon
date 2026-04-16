import { Database } from '../database'
import { ICreateReactionInput } from '../interfaces/ICreateReactionInput'
import { Reaction } from '../models/Reaction'

export class ReactionService {
  private database: Database

  public constructor() {
    this.database = new Database()
  }

  public async createReaction(data: ICreateReactionInput): Promise<Reaction> {
    const { type, userId, postId } = data

    if (!type || !userId || !postId) {
      throw new Error('type, userId und postId sind erforderlich')
    }

    if (type !== 'LIKE' && type !== 'DISLIKE') {
      throw new Error('Type muss LIKE oder DISLIKE sein')
    }

    await this.database.executeSQL(`
      INSERT INTO reactions (type, userId, postId)
      VALUES ('${type}', ${userId}, ${postId})
    `)

    return new Reaction(type, userId, postId)
  }
}