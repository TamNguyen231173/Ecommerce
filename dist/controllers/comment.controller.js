"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comment_service_1 = require("~/services/comment.service");
class CommentController {
    static async createComment(req, res) {
        const data = await comment_service_1.CommentService.createComment({
            product_id: req.params.product_id,
            user_id: req.user._id,
            content: req.body.content,
            parent_id: req.body.parent_id
        });
        res.status(201).json({
            message: 'Comment created successfully',
            data
        });
    }
    static async getComments(req, res) {
        const data = await comment_service_1.CommentService.getCommentsByParentId({
            product_id: req.params.product_id,
            parent_id: req.query.parent_id,
            limit: Number(req.query.limit),
            offset: Number(req.query.offset)
        });
        res.status(200).json({
            message: 'Comments retrieved successfully',
            data
        });
    }
    static async deleteComments(req, res) {
        await comment_service_1.CommentService.deleteComments({
            comment_id: req.params.comment_id,
            product_id: req.params.product_id
        });
        res.status(200).json({
            message: 'Comment deleted successfully'
        });
    }
}
exports.CommentController = CommentController;
