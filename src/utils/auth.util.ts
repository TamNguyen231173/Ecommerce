import jwt from 'jsonwebtoken'
import { Shop } from '~/types/shop.type'
import { ApiError } from './api-error.util'
import { http } from 'winston'
import httpStatus from 'http-status'

export const createTokenPair = async ({ payload, privateKey }: { payload: Shop; privateKey: string }) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      expiresIn: '1 day',
      algorithm: 'RS256'
    })

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days',
      algorithm: 'RS256'
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
  }
}

export const verifyJwt = async ({ token, publicKey }: { token: string; publicKey: string }) => {
  try {
    const decoded = (await jwt.verify(token, publicKey, {
      algorithms: ['RS256']
    })) as Shop

    return decoded
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Verify token failed')
  }
}
