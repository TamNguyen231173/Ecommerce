import { Document, Schema, model } from 'mongoose'
import { UserRole, UserRoleName, UserStatus } from '~/types'

interface UserRoleDocument extends UserRole, Document {}

// const grantList = [
//   { role: 'admin', resource: 'user', action: ['create', 'read', 'update', 'delete'], attributes: '*' },
//   { role: 'admin', resource: 'role', action: ['create', 'read', 'update', 'delete'], attributes: '*' },G

const schema = new Schema<UserRoleDocument>(
  {
    name: { type: String, default: UserRoleName.USER, enum: Object.values(UserRoleName) },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    status: { type: String, default: UserStatus.PENDING, enum: Object.values(UserStatus) },
    grants: [
      {
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: '*' }
      }
    ]
  },
  { timestamps: true }
)

export const UserRoleModel = model<UserRoleDocument>('UserRole', schema)
