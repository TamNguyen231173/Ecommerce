import { Document, Schema, Types, model } from 'mongoose'
import { Cart } from '../types/cart.type'

export interface CartDocument extends Cart, Document {}

const schema = new Schema<CartDocument>(
  {
    state: { type: String, required: true },
    products: [{ type: Schema.Types.Mixed, required: true }],
    count_products: { type: Number, default: 0 },
    user: { type: Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

schema.pre('findOneAndUpdate', async function (next) {
  const cart = await this.model.findOne(this.getQuery())
  if (cart) {
    cart.count_products = cart.products.length
    await cart.save()
  }
  next()
})

export const CartModel = model<CartDocument>('Cart', schema)
