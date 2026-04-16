import { Router, Request, Response } from 'express'
import { UserService } from '../services/UserService'

const router = Router()
const userService = new UserService()

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await userService.login(username, password)

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
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(401).json({ message })
  }
})

export default router