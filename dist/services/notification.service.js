"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("~/models/notification.model");
const types_1 = require("~/models/types");
class NotificationService {
    static async pushNotiToSystem({ type = 'SHOP_001', receiver, sender, options = {} }) {
        let noti_content;
        if (type === types_1.NotiType.ORDER_001) {
            noti_content = `${sender} vừa thêm một sản phẩm mới: @@@@`;
        }
        else if (type === types_1.NotiType.PROMOTION_001)
            noti_content = `${sender} vừa thêm một voucher mới: @@@@`;
        return notification_model_1.NotificationModel.create({
            type,
            sender,
            receiver,
            content: noti_content,
            options
        });
    }
    static async listNotiByUser({ user_id, type = 'ALL', isRead = false }) {
        const match = {
            receiver: user_id
        };
        if (type !== 'ALL')
            match['type'] = type;
        return notification_model_1.NotificationModel.aggregate([
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
        ]);
    }
}
exports.NotificationService = NotificationService;
