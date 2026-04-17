import { Router, Request, Response } from 'express'
import { UserService } from '../services/UserService'

// Initialize the Express router
const router = Router()
// Instantiate the user service for business logic
const userService = new UserService()

// Endpoint for new user registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Call service to create a new user with request body data
    const user = await userService.register(req.body)

    // Respond with success and filtered user data
    res.status(201).json({
      message: 'User erstellt',
      user: {
        username: user.username,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    })
  } catch (error) {
    // Handle errors and return appropriate error message
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(400).json({ message })
  }
})

export default router
