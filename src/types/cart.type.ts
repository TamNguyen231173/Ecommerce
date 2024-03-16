export enum CartState {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface Cart {
  _id?: any
  state: string
  products: any[]
  count_products: number
  user: any
}
