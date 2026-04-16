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
    console.log('COMMENT CREATE ERROR:', error)
    res.status(400).json({
      message: 'Kommentar erstellen fehlgeschlagen',
      error,
    })
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
    console.log('COMMENT UPDATE ERROR:', error)
    res.status(400).json({
      message: 'Kommentar Update fehlgeschlagen',
      error,
    })
  }
})

router.delete('/comments/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { userId, userRole } = req.body

    await commentService.deleteComment(id, userId, userRole)

    res.status(200).json({
      message: 'Kommentar gelöscht',
    })
  } catch (error) {
    console.log('COMMENT DELETE ERROR:', error)
    res.status(500).json({
      message: 'Kommentar Delete fehlgeschlagen',
      error,
    })
  }
})

router.get('/comments/:postId', async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId)

    const comments = await commentService.getCommentsByPostId(postId)

    res.status(200).json({
      message: 'Kommentare geladen',
      comments,
    })
  } catch (error) {
    console.log('COMMENT GET ERROR:', error)
    res.status(500).json({
      message: 'Kommentare laden fehlgeschlagen',
      error,
    })
  }
})

export default router