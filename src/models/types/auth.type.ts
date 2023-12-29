import { Shop } from './shop.type'

export interface loginBody {
  email: string
  password: string
}

export interface registerBody {
  name: string
  email: string
  password: string
}

export interface Token {
  user?: Shop
  publicKey?: string
  refreshToken?: []
}
