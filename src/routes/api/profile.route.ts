import { Router } from 'express'
import { ProfileController } from '~/controllers/profile.controller'
import { grantAccess } from '~/middlewares/rbac.middleware'

export const profileRouter = Router()

profileRouter.get('', grantAccess('readAny', 'profile'), ProfileController.getProfiles)
profileRouter.get('/:id', grantAccess('readOwn', 'profile'), ProfileController.getProfile)
