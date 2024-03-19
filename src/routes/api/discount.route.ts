import { Router } from 'express'
import { DiscountController } from '~/controllers/discount.controller'
import { authentication } from '~/middlewares/auth.middleware'

export const discountRouter = Router()

discountRouter.get('/:shop_id/get-products', DiscountController.getAllProductsWithDiscountCode)
discountRouter.get('/:shop_id/get-discounts', DiscountController.getAllDiscountsCodeByShop)
discountRouter.post('/:shop_id/get-discount-amount', DiscountController.getDiscountAmount)

discountRouter.use(authentication)
discountRouter.post('/', DiscountController.createDiscountCode)
discountRouter.delete('/:discount_id/delete-discount', DiscountController.deleteDiscountCode)
discountRouter.patch('/:shop_id/:discount_id/cancel-discount', DiscountController.cancelDiscountCode)
