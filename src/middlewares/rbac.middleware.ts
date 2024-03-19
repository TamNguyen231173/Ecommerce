import { Request, Response, NextFunction } from 'express'
import { rbac } from './role.middleware'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'
import { roleList } from '~/services/rbac.service'

/**
 * @desc Grant access to a resource
 * @param {string} action - create:any, read:any, update:any, delete:any, create:own, read:own, update:own, delete:own
 * @param {*} resource - profile, balance, ...
 * */
export const grantAccess = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      rbac.setGrants(
        await roleList({
          userId: req.user._id
        })
      )
      const role_name = req.query.role as string
      const permission = await rbac.can(role_name)[action](resource)
      if (!permission.granted) throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied')

      next()
    } catch (error) {
      next(error)
    }
  }
}
