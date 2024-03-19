import { KeyTokenModel } from '~/models/account/keyToken.model'
import { Shop } from '~/types/shop.type'

export class KeyTokenService {
  static async createKeyToken({
    user,
    publicKey,
    refreshToken
  }: {
    user: Shop
    publicKey: string
    refreshToken: string
  }) {
    try {
      // const tokens = await TokenModel.create({
      //   user: user._id,
      //   publicKey: publicKey.toString()
      // })

      // return tokens ? tokens.publicKey : null

      const filter = { user }
      const update = { publicKey: publicKey.toString(), refreshToken }
      const options = { new: true, upsert: true }

      const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
    }
  }

  static async findByUserId(userId: string) {
    return KeyTokenModel.findOne({ user: userId })
  }

  static async removeKeyById(_id: string) {
    return KeyTokenModel.findByIdAndDelete({ _id })
  }

  static async findByRefreshToken(refreshToken: string) {
    return KeyTokenModel.findOne({ refreshToken })
  }

  static async findByRefreshTokenUsed(refreshToken: string) {
    return await KeyTokenModel.findOne({ refreshTokenUsed: { $in: refreshToken } }).lean()
  }

  static async removeKeyByUserId(userId: string) {
    console.log(userId)
    return KeyTokenModel.findOneAndDelete({ user: userId })
  }
}
