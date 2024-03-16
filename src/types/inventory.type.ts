import { Product } from './product.type'
import { Shop } from './shop.type'

export interface Inventory {
  _id?: any
  product: Product | string
  location?: string
  stock?: number
  shop?: Shop | string
  reservations?: any[]
}
