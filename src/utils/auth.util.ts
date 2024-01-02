import jwt from 'jsonwebtoken';

export const createTokenPair = async ({ payload, privateKey }: { payload: any; privateKey: string }) => {
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
