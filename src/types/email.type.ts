export interface NewTemplateDto {
  id: string
  name: string
  html: {
    title: string
    content: string
  }
}

export interface SendEmailCommandDto {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}
