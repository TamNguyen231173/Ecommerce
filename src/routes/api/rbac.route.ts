import { Router } from 'express'
import { getResources, getRoles, newRole, newResource } from '~/controllers/rbac.controller'
import 'express-async-errors'

export const rbacRouter = Router()

rbacRouter.get('/resource', getResources)
rbacRouter.get('/role', getRoles)
rbacRouter.post('/resource', newResource)
rbacRouter.post('/role', newRole)
