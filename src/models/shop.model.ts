import { Document, Schema, model } from 'mongoose'
import { Shop } from './types/shop.type'

interface ShopDocument extends Shop, Document {}

export enum ShopRole {
  SHOP = 'shop',
  WRITER = 'writer',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export enum ShopStatus {
  OPEN = 'open',
  CLOSE = 'close'
}

const schema = new Schema<Shop>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    verify: { type: Boolean, required: true },
    roles: [{ type: String, required: true }]
  },
  { timestamps: true }
)

export const ShopModel = model<ShopDocument>('Shop', schema)
