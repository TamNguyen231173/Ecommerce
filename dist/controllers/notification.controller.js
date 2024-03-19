"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notification_service_1 = require("~/services/notification.service");
class NotificationController {
    static async getListNoti(req, res, next) {
        const data = await notification_service_1.NotificationService.listNotiByUser({
            user_id: req.user._id,
            type: req.query.type,
            isRead: req.query.isRead
        });
        res.status(http_status_1.default.OK).json({
            message: 'Get list notification successfully',
            data
        });
    }
}
exports.NotificationController = NotificationController;
