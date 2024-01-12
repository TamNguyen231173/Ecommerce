import { Document, Schema, model } from 'mongoose'
import { User, UserStatus } from '~/models/types'

interface UserDocument extends User, Document {}

const schema = new Schema<UserDocument>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    salf: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    sex: { type: String, default: '' },
    avatar: { type: String, default: '' },
    dob: { type: Date, default: null },
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    status: { type: String, default: UserStatus.PENDING, enum: Object.values(UserStatus) }
  },
  { timestamps: true }
)

export const UserModel = model<UserDocument>('User', schema)
