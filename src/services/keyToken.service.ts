import { TokenModel } from '~/models/token.model'
import { Shop } from '~/models/types/shop.type'

export class KeyTokenService {
  static async createKeyToken({ user, publicKey }: { user: Shop; publicKey: string }) {
    try {
      const tokens = await TokenModel.create({
        user: user._id,
        publicKey: publicKey.toString()
      })

      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
    }
  }
}
