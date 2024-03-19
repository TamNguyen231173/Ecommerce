import { Request, Response } from 'express'
import { EmailService } from '~/services/email.service'
import { TemplateService } from '~/services/template.service'

export class EmailController {
  static async newTemplate(req: Request, res: Response) {
    const newTemplate = await EmailService.newTemplate(req.body)
    return res.json({ message: 'Template created', data: newTemplate })
  }

  static async getTemplate(req: Request, res: Response) {
    const template = await TemplateService.getTemplate(req.query.name as string)
    return res.json({ message: 'Template found', data: template })
  }
}
