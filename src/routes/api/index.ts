import { Router } from 'express'
import { shopRouter } from './shop.route'
import { authRouter } from './auth.route'
import { productRouter } from './product.route'
import { authentication } from '~/middlewares/auth.middleware'
import { discountRouter } from './discount.route'
import { cartRouter } from './cart.route'
import { checkoutRouter } from './checkout.route'
import { inventoryRouter } from './inventory.route'
import { commentRouter } from './comment.route'
import { notiRouter } from './notification.route'
import { uploadRouter } from '~/routes/api/uploadRouter'

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/shop', authentication, shopRouter)
apiRouter.use('/product', productRouter)
apiRouter.use('/discount', discountRouter)
apiRouter.use('/cart', authentication, cartRouter)
apiRouter.use('/checkout', authentication, checkoutRouter)
apiRouter.use('/inventory', authentication, inventoryRouter)
apiRouter.use('/comment', authentication, commentRouter)
apiRouter.use('/notification', authentication, notiRouter)
apiRouter.use('/upload', authentication, uploadRouter)

export default apiRouter
