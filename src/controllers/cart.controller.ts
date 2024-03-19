import { Request, Response } from 'express'
import { CartService } from '~/services/cart.service'

export class CartController {
  static async addToCart(req: Request, res: Response) {
    const data = await CartService.addToCart({
      user_id: req.user._id,
      product: req.body.product
    })
    res.status(200).json({
      message: 'Add to cart successfully',
      data
    })
  }

  static async addToCartV2(req: Request, res: Response) {
    const data = await CartService.addToCartV2({
      user_id: req.user._id,
      shop_order_ids: req.body.shop_order_ids
    })
    res.status(200).json({
      message: 'Add to cart successfully',
      data
    })
  }

  static async deleteProductFromCart(req: Request, res: Response) {
    const data = await CartService.deleteProductFromCart({
      user_id: req.user._id,
      product_ids: req.body.products
    })
    res.status(200).json({
      message: 'Delete product from cart successfully',
      data
    })
  }

  static async getListCarts(req: Request, res: Response) {
    const data = await CartService.getListCarts(req.user._id)
    res.status(200).json({
      message: 'Get list carts successfully',
      data
    })
  }
}
