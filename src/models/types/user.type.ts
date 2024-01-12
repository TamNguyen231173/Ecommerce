import { Resource } from './resource.type'

export interface Role {
  _id?: any
  name: string
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  BLOCK = 'block'
}

export enum UserRoleName {
  USER = 'user',
  SHOP = 'shop',
  ADMIN = 'admin'
}

export interface UserGrant {
  resource?: Resource
  action?: string[]
  attributes?: string
}

export interface UserRole {
  _id?: any
  name?: UserRoleName
  slug?: string
  status?: UserStatus
  description?: string
  grants?: UserGrant[]
}

export interface User {
  _id?: any
  slug?: string
  name?: string
  password?: string
  salf?: string
  email?: string
  phone?: string
  sex?: string
  avatar?: string
  dob?: Date
  role?: Role
  status?: UserStatus
}
