import { Document, Schema, model } from 'mongoose'
import { Product } from '../types/product.type'

export enum ProductType {
  BOOK = 'book',
  ELECTRONIC = 'electronic',
  CLOTH = 'cloth',
  OTHER = 'other'
}

interface ProductDocument extends Product, Document {}

const schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    thumb: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true, enum: Object.values(ProductType) },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    attributes: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
)

export const ProductModel = model<ProductDocument>('Product', schema)
