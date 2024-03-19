"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notiRouter = void 0;
const express_1 = require("express");
const notification_controller_1 = require("~/controllers/notification.controller");
exports.notiRouter = (0, express_1.Router)();
exports.notiRouter.get('/list', notification_controller_1.NotificationController.getListNoti);
