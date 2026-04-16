import { Router } from 'express'
import registerRouter from './register'
import loginRouter from './login' 
import postsRouter from './posts'
import commentsRouter from './comments'
const router = Router()

router.use(registerRouter)
router.use(loginRouter)
router.use(postsRouter)
router.use(commentsRouter)
export default router