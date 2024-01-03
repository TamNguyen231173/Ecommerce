import { Shop } from './shop.type'

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed'
}

export enum DiscountAppliesTo {
  ALL = 'all',
  PRODUCT = 'product',
  COLLECTION = 'collection',
  CATEGORY = 'category'
}

export interface Discount {
  _id?: any
  name?: string
  description?: string
  type?: DiscountType
  value?: number
  code?: string
  start_date?: Date
  end_date?: Date
  discount_limit?: number
  discount_used?: number
  user_used?: []
  max_used_per_user?: number
  min_order_value?: number
  shop?: Shop | string
  is_active?: boolean
  applies_to?: DiscountAppliesTo
  product_ids?: any[]
}
