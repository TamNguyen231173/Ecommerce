import { Request, Response } from 'express'
import { CommentService } from '~/services/comment.service'

export class CommentController {
  static async createComment(req: Request, res: Response) {
    const data = await CommentService.createComment({
      product_id: req.params.product_id,
      user_id: req.user._id,
      content: req.body.content,
      parent_id: req.body.parent_id
    })
    res.status(201).json({
      message: 'Comment created successfully',
      data
    })
  }

  static async getComments(req: Request, res: Response) {
    const data = await CommentService.getCommentsByParentId({
      product_id: req.params.product_id,
      parent_id: req.query.parent_id as string | null,
      limit: Number(req.query.limit),
      offset: Number(req.query.offset)
    })
    res.status(200).json({
      message: 'Comments retrieved successfully',
      data
    })
  }

  static async deleteComments(req: Request, res: Response) {
    await CommentService.deleteComments({
      comment_id: req.params.comment_id,
      product_id: req.params.product_id
    })
    res.status(200).json({
      message: 'Comment deleted successfully'
    })
  }
}
