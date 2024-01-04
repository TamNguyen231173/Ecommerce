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
  shop?: Shop
  attributes?: any
  ratingsAverage?: number
  variations?: any[]
  isDraft?: boolean
  isPublished?: boolean
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
