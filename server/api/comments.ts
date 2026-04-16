import { Router, Request, Response } from 'express'
import { CommentService } from '../services/CommentService'

const router = Router()
const commentService = new CommentService()

router.post('/comments', async (req: Request, res: Response) => {
  try {
    const comment = await commentService.createComment(req.body)

    res.status(201).json({
      message: 'Kommentar erstellt',
      comment: {
        content: comment.content,
        authorId: comment.authorId,
        postId: comment.postId,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(400).json({ message })
  }
})

router.put('/comments/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { content } = req.body

    await commentService.updateComment(id, content)

    res.status(200).json({
      message: 'Kommentar aktualisiert',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(400).json({ message })
  }
})

router.delete('/comments/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    await commentService.deleteComment(id)

    res.status(200).json({
      message: 'Kommentar gelöscht',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler'
    res.status(500).json({ message })
  }
})

export default router