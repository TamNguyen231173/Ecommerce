import httpStatus from 'http-status'
import { TemplateModel } from '~/models'
import { NewTemplateDto } from '~/types/email.type'
import { ApiError } from '~/utils/api-error.util'
import { generateTemplate } from '~/utils/template.html'

export class TemplateService {
  static async newTemplate(newTemplateDto: NewTemplateDto) {
    const { name, id, html } = newTemplateDto
    console.log('newTemplateDto', newTemplateDto)
    const newTemplate = await TemplateModel.create({ name, id: Number(id), html: generateTemplate(html) })
    return newTemplate
  }

  static async getTemplate(name: string, token?: string) {
    const template = await TemplateModel.findOne({ name }).lean()
    if (!template) throw new ApiError(httpStatus.NOT_FOUND, 'Template not found')
    console.log('token++++++++', token)
    if (token) {
      template.html = template.html.split('{{code}}').join(token)
    }
    return template
  }
}
