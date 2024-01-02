import bcrypt from 'bcrypt'
import crypto from 'crypto'
import httpStatus from 'http-status'
import { ShopModel, ShopRole, ShopStatus } from '~/models/shop.model'
import { KeyToken, loginBody, registerBody } from '~/models/types'
import { ApiError } from '~/utils/api-error.util'
import { createTokenPair } from '~/utils/auth.util'
import { getInfoData } from '~/utils/filter.util'
import { KeyTokenService } from './keyToken.service'
import { ShopService } from './shop.service'

export class AuthService {
  static async generateTokens(payload: any) {
    const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })

    const publicKeyString = await KeyTokenService.createKeyToken({
      user: payload,
      publicKey
    })

    if (!publicKeyString) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot create public key')
    }

    const tokenPair = await createTokenPair({
      payload,
      privateKey
    })

    if (!tokenPair) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot create token pair')
    }

    return tokenPair
  }

  static async login(payload: loginBody) {
    const foundShop = await ShopService.findByEmail(payload.email)

    if (!foundShop) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Email not found')
    }

    const isMatch = await bcrypt.compare(payload.password, foundShop.password as string)

    if (!isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect')
    }

    const infoData = getInfoData({
      filed: ['_id', 'email', 'name', 'role', 'status', 'verify'],
      object: foundShop
    })

    const { accessToken, refreshToken } = await this.generateTokens(infoData)

    return {
      shop: infoData,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  static async register(payload: registerBody) {
    try {
      const holderShop = await ShopModel.findOne({ email: payload.email }).lean()

      if (holderShop) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists')
      }

      const hashPassword = await bcrypt.hash(payload.password, 10)

      const newShop = await ShopModel.create({
        ...payload,
        role: [ShopRole.SHOP],
        password: hashPassword,
        verify: false,
        status: ShopStatus.OPEN
      })

      if (newShop) {
        const infoData = getInfoData({
          filed: ['_id', 'email', 'name', 'role', 'status', 'verify'],
          object: newShop
        })

        const { accessToken, refreshToken } = await this.generateTokens(infoData)

        return {
          shop: infoData,
          tokens: {
            accessToken,
            refreshToken
          }
        }
      }

      return null
    } catch (error: any) {
      throw new ApiError(error.statusCode, error.message)
    }
  }

  static async logout(keyStore: KeyToken) {
    try {
      return KeyTokenService.removeKeyById(keyStore._id as string)
    } catch (error: any) {
      throw new ApiError(error.statusCode, error.message)
    }
  }
}
