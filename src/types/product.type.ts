import { Shop } from './shop.type'

export interface Product {
  _id?: any
  name: string
  slug?: string
  thumb?: string
  description?: string
  price: number
  quantity: number
  type?: string
  shop: Shop
  attributes?: any
  ratingsAverage?: number
  variations?: any[]
  isDraft?: boolean
  isPublished?: boolean
}

export interface ItemProduct {
  product_id: any
  price: number
  quantity: number
  product: Product
}

export interface Cloth {
  _id?: any
  brand?: string
  size?: string
  material?: string
}

export interface Electronic {
  _id?: any
  manufacturer?: string
  modelName?: string
  color?: string
}

export interface Furniture {
  _id?: any
  material?: string
  color?: string
  weight?: number
}

export interface Spu {
  _id?: any
  name: string
  slug?: string
  thumb?: string
  description?: string
  price: number
  category?: string[]
  quantity: number
  shop: Shop
  attributes?: any
  ratingsAverage?: number
  variations?: any[]
  isDraft?: boolean
  isPublished?: boolean
  isDeleted?: boolean
}

export interface Sku {
  _id?: any
  tierIndex?: number[]
  default: boolean
  sort?: number
  price: number
  stock: number
  product: Spu
  isDraft?: boolean
  isPublished?: boolean
  isDeleted?: boolean
}

export interface SpuCreatePayload {
  name: string
  slug?: string
  thumb?: string
  description?: string
  price: number
  category?: string[]
  quantity: number
  shop: string
  attributes?: any
  ratingsAverage?: number
  variations?: any[]
  isDraft?: boolean
  isPublished?: boolean
  sku_list?: SkuCreatePayload[]
}

export interface SkuCreatePayload {
  tierIndex?: number[]
  default: boolean
  sort?: number
  price: number
  stock: number
  product: string
  isDraft?: boolean
  isPublished?: boolean
}
