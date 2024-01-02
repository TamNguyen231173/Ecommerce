import { Router } from 'express'
import { AuthController } from '~/controllers/auth.controller'
import 'express-async-errors'
import { authentication } from '~/middlewares/auth.middleware'

const authRouter = Router()

authRouter.post('/login', AuthController.login)
authRouter.post('/register', AuthController.register)
authRouter.post('/logout', authentication, AuthController.logout)
authRouter.post('/refresh-token', authentication, AuthController.refreshToken)

export default authRouter
