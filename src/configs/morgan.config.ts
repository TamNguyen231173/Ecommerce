import morgan from 'morgan'
import { config } from '~/configs'
import { logger } from '~/configs/logger.config'
import { Request, Response, NextFunction } from 'express'

morgan.token('message', (req: Request, res: Response) => res.errorMessage)

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) }
})

const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) }
})

export default {
  successHandler,
  errorHandler
}
