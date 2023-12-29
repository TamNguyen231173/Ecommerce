import { Document, Schema, model } from 'mongoose'
import { ApiKey, Token } from './types'

interface ApiKeyDocument extends ApiKey, Document {}

const schema = new Schema<ApiKey>(
  {
    key: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const ApiKeyModel = model<ApiKeyDocument>('ApiKey', schema)
