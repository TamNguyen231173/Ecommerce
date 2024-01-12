import { Document, Schema, model } from 'mongoose'
import { Order, OrderStatus } from './types'
import { randomString } from '~/utils/random.util'

export interface OrderDocument extends Order, Document {}

const schema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkout: {
      type: Object,
      default: {}
    },
    shipping: {
      type: Object,
      default: {}
    },
    payment: {
      type: Object,
      default: {}
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    tracking: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    }
  },
  { timestamps: true }
)

schema.pre('save', function (next) {
  const order = this as OrderDocument
  order.tracking = randomString(10)
  next()
})

export const OrderModel = model<OrderDocument>('Order', schema)
