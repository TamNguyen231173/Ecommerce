import { Router } from 'express'
import { UploadController } from '~/controllers/upload.controller'

export const uploadRouter = Router()

uploadRouter.post('/image', UploadController.uploadImage)