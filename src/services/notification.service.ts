import { NotificationModel } from '~/models/notification.model'
import { NotiType } from '~/types'
import { QueryFilter } from '~/utils/filter.util'

export class NotificationService {
  static async pushNotiToSystem({
    type = 'SHOP_001',
    receiver,
    sender,
    options = {}
  }: {
    type: string
    receiver: string
    sender: string
    options?: any
  }) {
    let noti_content

    if (type === NotiType.ORDER_001) {
      noti_content = `${sender} vừa thêm một sản phẩm mới: @@@@`
    } else if (type === NotiType.PROMOTION_001) noti_content = `${sender} vừa thêm một voucher mới: @@@@`

    return NotificationModel.create({
      type,
      sender,
      receiver,
      content: noti_content,
      options
    })
  }

  static async listNotiByUser({
    user_id,
    type = 'ALL',
    isRead = false
  }: {
    user_id: string
    type: string
    isRead: boolean
  }) {
    const match: QueryFilter = {
      receiver: user_id
    }
    if (type !== 'ALL') match['type'] = type

    return NotificationModel.aggregate([
      {
        $match: match
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          type: 1,
          sender: 1,
          receiver: 1,
          content: 1,
          createdAt: 1,
          isRead: 1,
          options: 1
        }
      }
    ])
  }
}
