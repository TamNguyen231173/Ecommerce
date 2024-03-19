"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("./types");
const schema = new mongoose_1.Schema({
    type: { type: String, enum: types_1.NotiType, required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', required: true },
    content: { type: String, required: true },
    options: { type: Object, default: {} }
}, { timestamps: true });
exports.NotificationModel = (0, mongoose_1.model)('Notification', schema);
