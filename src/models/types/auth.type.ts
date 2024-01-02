import { Shop } from './shop.type'

export interface loginBody {
  email: string
  password: string
  refreshToken?: string
}

export interface registerBody {
  name: string
  email: string
  password: string
}

export interface KeyToken {
  _id?: any
  user?: Shop
  publicKey?: string
  refreshTokenUsed?: []
  refreshToken?: string
}

export interface ApiKey {
  key?: string
  status?: boolean
  permissions?: string[]
}
