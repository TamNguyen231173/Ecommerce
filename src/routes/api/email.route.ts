import { Router } from 'express'
import { EmailController } from '~/controllers/email.controller'

export const emailRouter = Router()

emailRouter.post('/new-template', EmailController.newTemplate)
emailRouter.get('/get-template', EmailController.getTemplate)
