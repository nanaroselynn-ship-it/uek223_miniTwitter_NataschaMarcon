import { Router, Request, Response } from 'express'
import { UserService } from '../services/UserService'

const router = Router()
const userService = new UserService()

router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body)

    res.status(201).json({
      message: 'User erstellt',
      user: {
        username: user.username,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(400).json({ message })
  }
})

export default router