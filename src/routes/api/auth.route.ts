import { Router } from 'express'
import { AuthController } from '~/controllers/auth.controller'
import 'express-async-errors'
import { authentication } from '~/middlewares/auth.middleware'
import { UserController } from '~/controllers/user.controller'

export const authRouter = Router()

// shop
authRouter.post('/login', AuthController.login)
authRouter.post('/register', AuthController.register)
authRouter.post('/logout', authentication, AuthController.logout)
authRouter.post('/refresh-token', authentication, AuthController.refreshToken)

// user
authRouter.post('/user/register', UserController.newUser)
