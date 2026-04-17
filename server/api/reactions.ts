import { Router, Request, Response } from 'express'
import { ReactionService } from '../services/ReactionService'

// Initialize the Express router
const router = Router()
// Instantiate the service to handle reaction logic
const reactionService = new ReactionService()

// Endpoint to create a new reaction (LIKE/DISLIKE) for a post
router.post('/reactions', async (req: Request, res: Response) => {
  try {
    // Save the reaction using the request body data
    const reaction = await reactionService.createReaction(req.body)

    // Send success response with the created reaction
    res.status(201).json({
      message: 'Reaction gespeichert',
      reaction,
    })
} catch (error) {
  // Log the error and return a failure message
  console.log('REACTION ERROR:', error)
  res.status(400).json({
    message: 'Reaction fehlgeschlagen',
    error,
  })
}
})

export default router
