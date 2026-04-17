import { Router, Request, Response } from 'express'
import { UserService } from '../services/UserService'

// Initialize router and user service logic
const router = Router()
const userService = new UserService()

// Endpoint for user authentication
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    // Validate credentials via user service
    const user = await userService.login(username, password)

    // Return success response with user profile details
    res.status(200).json({
      message: 'Login erfolgreich',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    })
  } catch (error) {
    // Handle authentication errors and return unauthorized status
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(401).json({ message })
  }
})

export default router
