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
    console.log('POST CREATE ERROR:', error)
    res.status(400).json({
      message: 'Post fehlgeschlagen',
      error,
    })
  }
})

router.get('/posts', async (_req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPosts()

    res.status(200).json({
      message: 'Beitraege wurden geladen',
      posts,
    })
  } catch (error) {
    console.log('POST GET ERROR:', error)
    res.status(500).json({
      message: 'Posts laden fehlgeschlagen',
      error,
    })
  }
})

router.put('/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { content } = req.body

    await postService.updatePost(id, content)

    res.status(200).json({
      message: 'Beitrag aktualisiert',
    })
  } catch (error) {
    console.log('POST UPDATE ERROR:', error)
    res.status(400).json({
      message: 'Post Update fehlgeschlagen',
      error,
    })
  }
})

router.delete('/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { userId, userRole } = req.body

    await postService.deletePost(id, userId, userRole)

    res.status(200).json({
      message: 'Beitrag gelöscht',
    })
  } catch (error) {
    console.log('POST DELETE ERROR:', error)
    res.status(500).json({
      message: 'Post Delete fehlgeschlagen',
      error,
    })
  }
})

export default router