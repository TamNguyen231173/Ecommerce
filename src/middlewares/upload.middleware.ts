import formidable from 'formidable'
import { ApiError } from '~/utils/api-error.util'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import httpStatus from 'http-status'

const fileOptions = (extFilter = [], limitedSize = 2 * 1024 * 1024, destination?: string): formidable.Options => {
  return {
    uploadDir: destination,
    // multiples: true,
    maxFieldsSize: limitedSize,
    filename: function (name: string, ext: string, part: object, form: object) {
      return uuid() + '_' + new Date().getTime().toString() + '_' + part['originalFilename']
    },
    filter: function ({ originalFilename }) {
      if (!originalFilename) return false
      const ext = originalFilename.split('.').pop()
      console.log(ext)

      if (extFilter.length > 0 && !extFilter.includes(ext)) throw new Error('Unsupported file type')
      return true
    },
    multiples: true
  }
}

export const uploadMiddleware =
  (extFilter = [], limitedSize = 2 * 1000 * 1000, destination?: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (destination && !fs.existsSync(destination)) {
      fs.mkdirSync(destination)
    }

    const form = formidable(fileOptions(extFilter, limitedSize, destination))
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log('File error', err)
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file'))
      }

      req.body = fields

      if (Object.keys(files).length <= 0) {
        req.files = {}
        return next()
      }

      if (files.file && !Array.isArray(files.file)) {
        files.file = [files.file]
      }
      const filesForFilter = []
      for (const field in files) {
        if (Array.isArray(files[field])) filesForFilter.concat(files[field])
        else filesForFilter.push(files[field])
      }

      req.files = files
      next()
    })
  }
