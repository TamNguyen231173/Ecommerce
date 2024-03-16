import { Document, Schema, model } from 'mongoose'
import { Notification, NotiType } from '../types'

export interface NotificationDocument extends Notification, Document {}

const schema = new Schema<NotificationDocument>(
  {
    type: { type: String, enum: NotiType, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    content: { type: String, required: true },
    options: { type: Object, default: {} }
  },
  { timestamps: true }
)

export const NotificationModel = model<NotificationDocument>('Notification', schema)
