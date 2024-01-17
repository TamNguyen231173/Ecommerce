import { Request, Response, NextFunction } from 'express'
import { rbac } from './role.middleware'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'

export const grantAccess = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role_name = req.query.role as string
      const permission = await rbac.can(role_name)[action](resource)
      if (!permission.granted) throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied')

      next()
    } catch (error) {
      next(error)
    }
  }
}
