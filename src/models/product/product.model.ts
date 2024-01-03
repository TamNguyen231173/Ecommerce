import { Document, Schema, model } from 'mongoose'
import { Product } from '../types/product.type'
import slugify from 'slugify'

export enum ProductType {
  BOOK = 'book',
  ELECTRONIC = 'electronic',
  CLOTH = 'cloth',
  OTHER = 'other',
  FURNITURE = 'furniture'
}

interface ProductDocument extends Product, Document {}

const schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    slug: { type: String },
    thumb: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true, enum: Object.values(ProductType) },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    attributes: { type: Schema.Types.Mixed, required: true },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val: number) => Math.round(val * 10) / 10
    },
    variations: {
      type: Array,
      default: []
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  { timestamps: true }
)

schema.index({ name: 'text', description: 'text' })

schema.pre('save', function (next) {
  console.log('this.name: ', this.name)
  this.slug = slugify(this.name as string, { lower: true })
  next()
})

export const ProductModel = model<ProductDocument>('Product', schema)
