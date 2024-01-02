import jwt from 'jsonwebtoken'
import { Shop } from '~/models/types/shop.type'

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
    console.log('error: ', error)
  }
}
