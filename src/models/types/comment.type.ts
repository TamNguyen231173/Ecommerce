import { Product } from './product.type'

export interface Comment {
  product: Product
  user: string
  content: string
  left: number
  right: number
  parent_id?: string
  isDeleted?: boolean
}
