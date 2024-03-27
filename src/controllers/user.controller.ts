import { Request, Response } from 'express'
import { UserService } from '~/services/user.service'

export class UserController {
  static async newUser(req: Request, res: Response) {
    await UserService.newUser(req.body)
    res.json({ message: 'Email verify sent, please check your email' })
  }

  static checkRegisterEmailToken(req: Request, res: Response) {
    UserService.checkRegisterEmailToken(req.params.token)
    res.json({ message: 'Email verify success' })
  }

  static async login(req: Request, res: Response) {
    const data = await UserService.login(req.body)
    res.json({
      message: 'Login success',
      data
    })
  }
}
