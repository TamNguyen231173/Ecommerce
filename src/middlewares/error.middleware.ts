import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { config } from '~/configs'
import { myLogger } from '~/configs/myLogger.config'
import { ApiError } from '~/utils/api-error.util'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err
  if (error && !(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }

  const { statusCode, message } = error
  res.errorMessage = error.message
  const response = { code: statusCode, message }

  if (config.env === 'development') {
    const resMessage = `${statusCode}-${Date.now()}ms - Response: ${JSON.stringify(error)}`
    myLogger.error(resMessage, [
      req.path,
      { requestId: req.requestId },
      { message: error.message }
    ])
    // logger.error(err.message + req.url)
  }

  res.status(statusCode).json(response)
}
