import httpStatus from 'http-status'
import cloudinary from '~/configs/cloundinary.config'
import { ApiError } from '~/utils/api-error.util'

export class UploadService {
  static async uploadImage(file: any) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'images',
        use_filename: true,
        unique_filename: false
      })
      return result
    } catch (error) {
      console.log(error)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file')
    }
  }
}
