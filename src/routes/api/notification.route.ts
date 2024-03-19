import { Router } from 'express'
import { NotificationController } from '~/controllers/notification.controller'

export const notiRouter = Router()

notiRouter.get('/list', NotificationController.getListNoti)
