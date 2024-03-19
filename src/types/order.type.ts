import { Product } from './product.type'

export interface Checkout {
  total_price: number
  total_apply_discount: number
  fees_ship: number
}

export interface Shipping {
  street: string
  city: string
  state: string
  country: string
}

export interface OrderPayment {
  method: string
  status: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCEL = 'CANCEL',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED'
}

export interface Order {
  _id?: any
  user?: any
  checkout?: Checkout
  shipping?: Shipping
  payment?: OrderPayment
  products?: Product[]
  tracking?: string
  status?: OrderStatus
}
