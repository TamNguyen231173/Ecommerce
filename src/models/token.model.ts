import { Document, Schema, model } from 'mongoose'
import { Token } from './types'

interface TokenDocument extends Token, Document {}

const schema = new Schema<Token>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    publicKey: { type: String, required: true },
    refreshToken: { type: Array, default: [] }
  },
  { timestamps: true }
)

export const TokenModel = model<TokenDocument>('Token', schema)
