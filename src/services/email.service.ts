import httpStatus from 'http-status'
import { ApiError } from '~/utils/api-error.util'
import { OtpService } from './otp.service'
import { TemplateService } from './template.service'
import { config } from '~/configs'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { NewTemplateDto, SendEmailCommandDto } from '~/types/email.type'

export class EmailService {
  private static sesClient = new SESClient({
    region: config.aws.region,
    credentials: {
      secretAccessKey: config.aws.secretAccessKey,
      accessKeyId: config.aws.accessKeyId
    }
  })

  static async newTemplate(newTemplateDto: NewTemplateDto) {
    const newTemplate = await TemplateService.newTemplate(newTemplateDto)
    return newTemplate
  }

  static async sendToken(email: string) {
    try {
      const { token } = await OtpService.newOtp(email)
      const { html } = await TemplateService.getTemplate('verify-email', token)

      // Send email
      const command = this.createSendEmailCommand({
        fromAddress: config.email.from,
        toAddresses: email,
        body: html,
        subject: 'Your verification code'
      })

      await this.sesClient.send(command)
    } catch (error) {
      console.error(error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email')
    }
  }

  static createSendEmailCommand({
    fromAddress,
    toAddresses,
    ccAddresses = [],
    body,
    subject,
    replyToAddresses = []
  }: SendEmailCommandDto) {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
        ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
      },
      Message: {
        Body: {
          Html: { Charset: 'UTF-8', Data: body }
        },
        Subject: { Charset: 'UTF-8', Data: subject }
      },
      Source: fromAddress,
      ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
    })
  }
}
