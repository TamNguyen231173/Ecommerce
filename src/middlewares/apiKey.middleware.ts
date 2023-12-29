import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { ApiError } from '~/utils/api-error.util'
import { ApiKeyService } from '~/services/apiKey.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Missing API key')
    }

    const objKey = await ApiKeyService.findById(key)
    if (!objKey) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid API key')
    }

    req.objKey = objKey

    return next()
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message)
  }
}

export const permission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions.includes(permission)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied')
    }

    const validPermission = req.objKey.permission.includes(permission)
    if (!validPermission) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied')
    }

    return next()
  }
}
