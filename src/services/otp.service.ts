import crypto from 'crypto'
import httpStatus from 'http-status'
import { OtpModel } from '~/models'
import { Otp } from '~/types'
import { ApiError } from '~/utils/api-error.util'

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

  static async checkEmailToken(otpToken: string): Promise<Otp> {
    const token = await OtpModel.findOne({ token: otpToken }).lean()

    if (!token) throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found')

    await OtpModel.deleteOne({ token })

    return token
  }
}
