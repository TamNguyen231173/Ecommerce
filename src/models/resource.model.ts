import { Document, Schema, model } from 'mongoose'
import { Resource } from './types'
import { randomString } from '~/utils/random.util'

export interface ResourceDocument extends Resource, Document {}

const schema = new Schema<ResourceDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
)

export const ResourceModel = model<ResourceDocument>('Resource', schema)
