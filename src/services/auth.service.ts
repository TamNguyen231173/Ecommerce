import { ShopModel, ShopRole, ShopStatus } from '~/models/shop.model'
import { registerBody } from '~/models/types'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { KeyTokenService } from './keyToken.service'
import { createTokenPair } from '~/utils/auth.util'
import { getInfoData } from '~/utils/filter.util'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'

export class AuthService {
  // static async createAccessToken() {}

  // static async createRefreshToken() {}

  // static async createToken() {}

  // static async verifyRefreshToken() {}

  static async login() {
    //  try {
    // } catch (error) {
    //   console.log(error)
    // }
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
          user: newShop,
          publicKey
        })

        if (!publicKeyString) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot create public key')
        }

        const tokenPair = await createTokenPair({
          payload: newShop.toObject(),
          privateKey
        })

        if (!tokenPair) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot create token pair')
        }

        const { accessToken, refreshToken } = tokenPair

        return {
          shop: getInfoData({
            filed: ['_id', 'email', 'name', 'role', 'status', 'verify'],
            object: newShop
          }),
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
}
