import { Router } from 'express'
import registerRouter from './register'
import loginRouter from './login' 
import postsRouter from './posts'
import commentsRouter from './comments'
import reactionsRouter from './reactions'

// Main API router to aggregate all sub-routes
const router = Router()

// Mount individual feature routers
router.use(registerRouter)
router.use(loginRouter)
router.use(postsRouter)
router.use(commentsRouter)
router.use(reactionsRouter)

export default router
