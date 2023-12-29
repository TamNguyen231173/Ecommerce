import { Document, Schema, model } from 'mongoose'
import { ApiKey } from './types'

interface ApiKeyDocument extends ApiKey, Document {}

export enum API_KEY_PERMISSION {
  USER = 'user',
  ADMIN = 'admin'
}

const schema = new Schema<ApiKey>(
  {
    key: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    permissions: { type: [String], default: [] }
  },
  { timestamps: true }
)

export const ApiKeyModel = model<ApiKeyDocument>('ApiKey', schema)
