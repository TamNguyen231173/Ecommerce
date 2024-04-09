import { Schema, model } from 'mongoose'
import { Spu } from '~/types'

export interface SpuDocument extends Spu, Document {}

const schema = new Schema<SpuDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    thumb: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: [{ type: String }],
    quantity: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    attributes: { type: Object },
    ratingsAverage: { type: Number },
    variations: [{ type: Object }],
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

schema.index({ name: 'text', description: 'text' })

export const SpuModel = model<SpuDocument>('Spu', schema)
