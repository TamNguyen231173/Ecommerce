import { Request, Response } from 'express'
import { CheckoutService } from '~/services/checkout.service'

export class CheckoutController {
  static async checkoutReview(req: Request, res: Response) {
    const data = await CheckoutService.checkout({
      cart_id: req.params.cart_id,
      user_id: req.user._id,
      shop_order_ids: req.body.shop_order_ids
    })
    res.status(200).json({
      message: 'Checkout successfully',
      data
    })
  }

  static async checkoutOrder(req: Request, res: Response) {
    const data = await CheckoutService.orderByUser({
      cart_id: req.params.cart_id,
      user_id: req.user._id,
      shop_order_ids_new: req.body.shop_order_ids,
      user_payment: req.body.user_payment,
      user_address: req.body.user_address
    })
    res.status(200).json({
      message: 'Checkout successfully',
      data
    })
  }
}
