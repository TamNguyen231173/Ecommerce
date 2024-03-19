import { NextFunction, Response, Request } from 'express'
import { UploadService } from '~/services/upload.service'

export class UploadController {
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    const data = await UploadService.uploadImage(req.files)
    res.json({ message: 'Upload image successfully' })
  }
}
