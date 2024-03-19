import { Document, Schema, model } from 'mongoose'
import { Furniture } from '../../types/product.type'

interface FurnitureDocument extends Furniture, Document {}

const schema = new Schema<Furniture>(
  {
    material: { type: String, required: true },
    color: { type: String, required: true },
    weight: { type: Number, required: true }
  },
  { timestamps: true }
)

export const FurnitureModel = model<FurnitureDocument>('Furniture', schema)
