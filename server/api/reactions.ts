import { Router, Request, Response } from 'express'
import { ReactionService } from '../services/ReactionService'

const router = Router()
const reactionService = new ReactionService()

router.post('/reactions', async (req: Request, res: Response) => {
  try {
    const reaction = await reactionService.createReaction(req.body)

    res.status(201).json({
      message: 'Reaction gespeichert',
      reaction,
    })
} catch (error) {
  console.log('REACTION ERROR:', error)
  res.status(400).json({
    message: 'Reaction fehlgeschlagen',
    error,
  })
}
})
export default router