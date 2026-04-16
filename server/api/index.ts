import { Router } from 'express'
import registerRouter from './register'
import loginRouter from './login' 
import postsRouter from './posts'

const router = Router()

router.use(registerRouter)
router.use(loginRouter)
router.use(postsRouter)

export default router