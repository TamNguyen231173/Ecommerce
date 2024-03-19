import { TemplateStatus } from '~/enums/email.enum'
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
  refreshTokenUsed?: string[]
  refreshToken?: string
}

export interface ApiKey {
  key?: string
  status?: boolean
  permissions?: string[]
}

export interface Otp {
  token: string
  email: string
  status: boolean
  expiredAt: Date
}

export interface Template {
  id: Number
  name: string
  status: TemplateStatus
  html: string
}
