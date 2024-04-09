import { Schema, model } from 'mongoose'
import { Sku } from '~/types'

export interface SkuDocument extends Sku, Document {}

const schema = new Schema<SkuDocument>(
  {
    tierIndex: { type: [Number], required: true },
    default: { type: Boolean, default: false },
    sort: { type: Number },
    price: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    stock: { type: Number, required: true },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export const SkuModel = model<SkuDocument>('Sku', schema)
