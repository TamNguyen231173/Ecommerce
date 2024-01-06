import { Router } from 'express'
import { CheckoutController } from '~/controllers/checkout.controller'
import 'express-async-errors'

export const checkoutRouter = Router()

checkoutRouter.post('/:cart_id/review', CheckoutController.checkoutReview)
checkoutRouter.post('/:cart_id/order', CheckoutController.checkoutOrder)
