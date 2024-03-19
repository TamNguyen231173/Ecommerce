import httpStatus from 'http-status'
import cloudinary from '~/configs/cloundinary.config'
import { ApiError } from '~/utils/api-error.util'

export class UploadService {
  static async uploadImage(files: any[]) {
    try {
      const promises = files.map((file) => cloudinary.uploader.upload(file.path))
      return await Promise.all(promises)
    } catch (error) {
      console.log(error)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file')
    }
  }
}
