import httpStatus from 'http-status'
import { UserModel } from '~/models'
import { NewUserDto } from '~/types'
import { ApiError } from '~/utils/api-error.util'
import { EmailService } from './email.service'

export class UserService {
  static async newUser(newUserDto: NewUserDto) {
    const { email, captcha } = newUserDto
    const user = await UserModel.findOne({ email }).lean()
    if (user) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists')

    await EmailService.sendToken(email)
    // await UserModel.create(newUserDto)
  }

  // static checkRegisterEmailToken() {}
}
