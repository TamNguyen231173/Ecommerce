import { Schema, model } from 'mongoose'
import { Otp } from '~/types'

interface OtpDocument extends Otp, Document {}

const schema = new Schema<OtpDocument>(
  {
    token: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Boolean, default: false },
    expiredAt: { type: Date, expires: 60 }
  },
  { timestamps: true }
)

export const OtpModel = model<OtpDocument>('Otp', schema)
