import { Router } from 'express'
import shopRouter from './shop.route'
import authRouter from './auth.route'

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/shop', shopRouter)

export default apiRouter
