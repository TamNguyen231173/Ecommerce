import httpStatus from 'http-status'
import { NotificationService } from '~/services/notification.service'

export class NotificationController {
  static async getListNoti(req: any, res: any, next: any) {
    const data = await NotificationService.listNotiByUser({
      user_id: req.user._id,
      type: req.query.type,
      isRead: req.query.isRead
    })
    res.status(httpStatus.OK).json({
      message: 'Get list notification successfully',
      data
    })
  }
}
