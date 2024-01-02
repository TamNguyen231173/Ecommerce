import { Document, Schema, model } from 'mongoose'
import { KeyToken } from './types'

interface KeyTokenDocument extends KeyToken, Document {}

const schema = new Schema<KeyToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    publicKey: { type: String, required: true },
    refreshTokenUsed: { type: Array, default: [] },
    refreshToken: { type: String, required: true }
  },
  { timestamps: true }
)

export const KeyTokenModel = model<KeyTokenDocument>('KeyToken', schema)
