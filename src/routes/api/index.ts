import { Router } from 'express'
import shopRouter from './shop.route'
import authRouter from './auth.route'
import { productRouter } from './product.route'
import { authentication } from '~/middlewares/auth.middleware'

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/shop', authentication, shopRouter)
apiRouter.use('/product', authentication, productRouter)

export default apiRouter