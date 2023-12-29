import { Request, Response } from 'express'
import { AuthService } from '~/services/auth.service'

export class AuthController {
  static async login(req: Request, res: Response) {
    return res.status(200).json({
      message: 'Login successfully'
    })
  }

  static async register(req: Request, res: Response) {
    const data = await AuthService.register(req.body)
    return res.status(200).json({
      message: 'Register successfully',
      data
    })
  }
}
