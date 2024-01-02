import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import { KeyTokenService } from '~/services/keyToken.service'
import { ApiError } from '~/utils/api-error.util'
import { HEADER } from './apiKey.middleware'

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString()
  if (!userId) throw new ApiError(httpStatus.FORBIDDEN, 'Missing client id')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new ApiError(httpStatus.NOT_FOUND, 'Client id not found')

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString().replace('Bearer ', '')
  if (!accessToken) throw new ApiError(httpStatus.FORBIDDEN, 'Missing access token')

  try {
    if (!keyStore.publicKey) throw new ApiError(httpStatus.FORBIDDEN, 'Missing public key')
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey) as any
    if (userId !== decodeUser?._id) throw new ApiError(httpStatus.FORBIDDEN, 'Invalid access token')

    req.keyStore = keyStore
    req.user = decodeUser

    return next()
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message)
  }
}
