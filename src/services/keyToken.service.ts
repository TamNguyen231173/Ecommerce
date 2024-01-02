import { KeyTokenModel } from '~/models/keyToken.model'
import { Shop } from '~/models/types/shop.type'

export class KeyTokenService {
  static async createKeyToken({ user, publicKey }: { user: Shop; publicKey: string }) {
    try {
      // const tokens = await TokenModel.create({
      //   user: user._id,
      //   publicKey: publicKey.toString()
      // })

      // return tokens ? tokens.publicKey : null

      const filter = { user }
      const update = { publicKey: publicKey.toString() }
      const options = { new: true, upsert: true }

      const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
    }
  }

  static async findByUserId(userId: string) {
    return KeyTokenModel.findOne({ user: userId }).lean()
  }

  static async removeKeyById(_id: string) {
    return KeyTokenModel.findByIdAndDelete({ _id })
  }
}
