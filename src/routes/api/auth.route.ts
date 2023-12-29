import { Router } from 'express'
import { AuthController } from '~/controllers'
import 'express-async-errors'

const authRouter = Router()

authRouter.post('/login', AuthController.login)
authRouter.post('/register', AuthController.register)

export default authRouter
