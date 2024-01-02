import { Request, Response } from 'express'
import { AuthService } from '~/services/auth.service'

export class AuthController {
  static async login(req: Request, res: Response) {
    const data = await AuthService.login(req.body)
    return res.status(200).json({
      message: 'Login successfully',
      data
    })
  }

  static async register(req: Request, res: Response) {
    const data = await AuthService.register(req.body)
    return res.status(200).json({
      message: 'Register successfully',
      data
    })
  }

  static async logout(req: Request, res: Response) {
    const data = await AuthService.logout(req.keyStore)
    return res.status(200).json({
      message: 'Logout successfully',
      data
    })
  }
}
