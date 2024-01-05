import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { KeyTokenService } from '~/services/keyToken.service'
import { ApiError } from '~/utils/api-error.util'
import { HEADER } from './apiKey.middleware'
import { verifyJwt } from '~/utils/auth.util'
import { Shop } from '~/models/types/shop.type'
import { ShopService } from '~/services/shop.service'
import { http } from 'winston'

const verifyToken = async (token: string, publicKey: string, userId: string, options?: string) => {
  try {
    const decodedUser = (await verifyJwt({
      token,
      publicKey
    })) as Shop
    if (!decodedUser && options === 'refreshToken') {
      await KeyTokenService.removeKeyByUserId(userId)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token')
    }
    if (userId !== decodedUser?._id) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token')

    const shop = await ShopService.findByEmail(decodedUser.email as string)
    if (!shop) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token')

    return shop
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message)
  }
}

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString()
  if (!userId) throw new ApiError(httpStatus.FORBIDDEN, 'Missing client id')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new ApiError(httpStatus.NOT_FOUND, 'Client id not found')
  if (!keyStore.publicKey) throw new ApiError(httpStatus.FORBIDDEN, 'Missing public key')

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString().replace('Bearer ', '')
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString().replace('Bearer ', '')

  try {
    if (refreshToken) {
      const decodedUser = await verifyToken(refreshToken, keyStore.publicKey, userId, 'refreshToken')
      req.keyStore = keyStore
      req.user = decodedUser
      req.refreshToken = refreshToken
    } else if (accessToken) {
      const decodedUser = await verifyToken(accessToken, keyStore.publicKey, userId)
      req.keyStore = keyStore
      req.user = decodedUser
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, 'Missing access token')
    }

    return next()
  } catch (error: any) {
    return next(error)
  }
}
