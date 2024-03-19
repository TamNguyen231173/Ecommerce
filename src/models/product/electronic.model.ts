import { Document, Schema, model } from 'mongoose'
import { Electronic } from '../../types/product.type'

interface ElectronicDocument extends Electronic, Document {}

const schema = new Schema<Electronic>(
  {
    manufacturer: { type: String, required: true },
    modelName: { type: String, required: true },
    color: { type: String, required: true }
  },
  { timestamps: true }
)

export const ElectronicModel = model<ElectronicDocument>('Electronic', schema)
