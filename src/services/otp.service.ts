import crypto from 'crypto'
import { OtpModel } from '~/models'

export class OtpService {
  static async newOtp(email: string) {
    const token = this.generateTokenRandom()
    const newOtp = await OtpModel.create({ token, email })
    return newOtp
  }

  static generateTokenRandom() {
    const token = crypto.randomInt(0, Math.pow(2, 32))
    return token
  }
}
