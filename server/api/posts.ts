import { Router, Request, Response } from 'express'
import { PostService } from '../services/PostService'

const router = Router()
const postService = new PostService()

router.post('/posts', async (req: Request, res: Response) => {
  try {
    const post = await postService.createPost(req.body)

    res.status(201).json({
      message: 'Beitrag erstellt',
      post: {
        content: post.content,
        authorId: post.authorId,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(400).json({ message })
  }
})

router.get('/posts', async (_req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPosts()
        res.status(200).json({
            message: 'Beitraege wurde geladen', posts,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Fehler'
        res.status(500).json({ message })
    }
})

export default router