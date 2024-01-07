import { Router } from 'express'
import { CommentController } from '~/controllers/comment.controller'

export const commentRouter = Router()

commentRouter.post('/:product_id/create', CommentController.createComment)
commentRouter.get('/:product_id', CommentController.getComments)
