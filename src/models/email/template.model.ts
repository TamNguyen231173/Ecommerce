import { Schema, model } from 'mongoose'
import { TemplateStatus } from '~/enums/email.enum'
import { Template } from '~/types'

interface TemplateDocument extends Template, Document {}

const schema = new Schema<TemplateDocument>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
    status: { type: String, required: true, enum: Object.values(TemplateStatus), default: TemplateStatus.ACTIVE },
    html: { type: String, required: true }
  },
  { timestamps: true }
)

export const TemplateModel = model<TemplateDocument>('Template', schema)
