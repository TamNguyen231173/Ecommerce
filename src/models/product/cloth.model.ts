import { Document, Schema, model } from 'mongoose'
import { Cloth } from '../types/product.type'

interface ClothDocument extends Cloth, Document {}

const schema = new Schema<Cloth>(
  {
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true }
  },
  { timestamps: true }
)

export const ClothModel = model<ClothDocument>('Cloth', schema)
