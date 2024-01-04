import { Document, Schema, Types, model } from 'mongoose'
import { Discount } from './types/discount.type'

export interface DiscountDocument extends Discount, Document {}

const schema = new Schema<DiscountDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: { type: Number, required: true },
    code: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    discount_limit: { type: Number, required: true },
    discount_used: { type: Number, default: 0 },
    user_used: [{ type: Types.ObjectId, ref: 'User', default: [] }],
    max_used_per_user: { type: Number, required: true },
    min_order_value: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    is_active: { type: Boolean, default: true },
    applies_to: {
      type: String,
      enum: ['all', 'product', 'collection', 'category'],
      default: 'all'
    },
    product_ids: [{ type: Types.ObjectId, ref: 'Product', default: [] }]
  },
  { timestamps: true }
)

export const DiscountModel = model<DiscountDocument>('Discount', schema)
