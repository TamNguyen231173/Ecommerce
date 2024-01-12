import { NextFunction, Response, Request } from 'express'

export class UploadController {
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Upload image successfully' })
  }
}
