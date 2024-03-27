import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { UserModel } from '~/models'
import { NewUserDto } from '~/types'
import { ApiError } from '~/utils/api-error.util'
import { EmailService } from './email.service'
import { OtpService } from './otp.service'
import { getInfoData } from '~/utils/filter.util'
import { AuthService } from './auth.service'

export class UserService {
  static async newUser(payload: NewUserDto) {
    const user = await UserModel.findOne({ email: payload.email }).lean()

    if (user) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists')

    await EmailService.sendToken(payload.email)

    const password = await bcrypt.hash(payload.password, 10)

    await UserModel.create({ ...payload, password })
  }

  static async checkRegisterEmailToken(otpToken: string) {
    const { email, token } = await OtpService.checkEmailToken(otpToken)

    if (token !== otpToken) throw new ApiError(httpStatus.BAD_REQUEST, 'Token not valid')

    const user = await UserModel.findOneAndUpdate({ email }, { status: true }).lean()

    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found')

    return user
  }

  static async login({ email, password }: { email: string; password: string }) {
    const user = await UserModel.findOne({ email }).lean()

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Email not found')

    const isMatch = await bcrypt.compare(password, user.password as string)

    if (!isMatch) throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect')

    const infoData = getInfoData({ filed: ['_id', 'email', 'name', 'role', 'status'], object: user })

    const { accessToken, refreshToken } = await AuthService.generateTokens(infoData)

    return { user: infoData, tokens: { accessToken, refreshToken } }
  }
}
