import { Document, Schema, model } from 'mongoose'
import { Inventory } from './types/inventory.type'

export interface InventoryDocument extends Inventory, Document {}

const schema = new Schema<Inventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    location: { type: String, required: true },
    stock: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    reservations: { type: Array, default: [] }
  },
  { timestamps: true }
)

export const InventoryModel = model<InventoryDocument>('Inventory', schema)
