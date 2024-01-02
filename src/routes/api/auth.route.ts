import { Router } from 'express'
import { AuthController } from '~/controllers'
import 'express-async-errors'
import { authentication } from '~/middlewares/auth.middleware'

const authRouter = Router()

authRouter.post('/login', AuthController.login)
authRouter.post('/register', AuthController.register)
authRouter.post('/logout', authentication, AuthController.logout)

export default authRouter
