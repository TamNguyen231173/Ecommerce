"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const mongoose_1 = require("mongoose");
const comment_model_1 = require("~/models/comment.model");
const product_repo_1 = require("~/models/repositories/product.repo");
class CommentService {
    static async createComment({ product_id, user_id, content, parent_id = null }) {
        const comment = await comment_model_1.CommentModel.create({
            product: new mongoose_1.Types.ObjectId(product_id),
            user: user_id,
            content,
            parent_id
        });
        let rightValue = 0;
        if (parent_id) {
            // reply comment
            const parentComment = await comment_model_1.CommentModel.findById(parent_id, 'right');
            if (!parentComment)
                throw new Error('Comment not found');
            rightValue = parentComment.right;
            await comment_model_1.CommentModel.updateMany({
                product: new mongoose_1.Types.ObjectId(product_id),
                right: { $gte: rightValue }
            }, {
                $inc: { right: 2 }
            });
            await comment_model_1.CommentModel.updateMany({
                product: new mongoose_1.Types.ObjectId(product_id),
                left: { $gt: rightValue }
            }, {
                $inc: { left: 2 }
            });
        }
        else {
            const maxRightValue = await comment_model_1.CommentModel.findOne({ product: product_id }, 'right', {
                sort: { right: -1 }
            });
            rightValue = maxRightValue ? maxRightValue.right + 1 : 1;
        }
        comment.left = rightValue;
        comment.right = rightValue + 1;
        return comment.save();
    }
    static async getCommentsByParentId({ product_id, parent_id, limit = 50, offset = 0 }) {
        if (!mongoose_1.Types.ObjectId.isValid(product_id)) {
            throw new Error('Invalid product_id');
        }
        const commonQuery = { product: new mongoose_1.Types.ObjectId(product_id) };
        const commonProjection = {
            left: 1,
            right: 1,
            content: 1,
            parent_id: 1
        };
        if (parent_id) {
            if (!mongoose_1.Types.ObjectId.isValid(parent_id)) {
                throw new Error('Invalid parent_id');
            }
            const parent = await comment_model_1.CommentModel.findById(parent_id);
            if (!parent)
                throw new Error('Comment not found');
            return comment_model_1.CommentModel.find({
                ...commonQuery,
                left: { $gt: parent.left },
                right: { $lt: parent.right }
            })
                .select(commonProjection)
                .sort({ left: 1 })
                .limit(limit)
                .skip(offset);
        }
        return comment_model_1.CommentModel.find({ ...commonQuery, parent_id: null })
            .select(commonProjection)
            .sort({ left: 1 })
            .limit(limit)
            .skip(offset);
    }
    static async deleteComments({ comment_id, product_id }) {
        const foundProduct = await product_repo_1.ProductRepo.findProductById({
            product_id
        });
        if (!foundProduct)
            throw new Error('Product not found');
        const comment = await comment_model_1.CommentModel.findById(comment_id);
        if (!comment)
            throw new Error('Comment not found');
        // Get left and right value of the comment
        const leftValue = comment.left;
        const rightValue = comment.right;
        // Get width of the comment
        const width = rightValue - leftValue + 1;
        // Delete the comment
        await comment_model_1.CommentModel.deleteMany({
            product: new mongoose_1.Types.ObjectId(product_id),
            left: { $gte: leftValue, $lte: rightValue }
        });
        // Update left and right value of the comments that are to the right of the deleted comment
        await comment_model_1.CommentModel.updateMany({
            product: new mongoose_1.Types.ObjectId(product_id),
            left: { $gt: rightValue }
        }, {
            $inc: { left: -width }
        });
        await comment_model_1.CommentModel.updateMany({
            product: new mongoose_1.Types.ObjectId(product_id),
            right: { $gt: rightValue }
        }, {
            $inc: { right: -width }
        });
    }
}
exports.CommentService = CommentService;
