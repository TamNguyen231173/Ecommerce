import { Document, Schema, model } from 'mongoose'
import { Comment } from './types/comment.type'

export interface CommentDocument extends Comment, Document {}

const schema = new Schema<CommentDocument>(
  {
    user: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    content: { type: String, required: true },
    left: { type: Number, default: null },
    right: { type: Number, default: null },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
    isDeleted: { type: Boolean, default: false, select: false }
  },
  { timestamps: true }
)

export const CommentModel = model<CommentDocument>('Comment', schema)
