import httpStatus from 'http-status'
import { CartRepo } from '~/repositories/cart.repo'
import { ProductRepo } from '~/repositories/product.repo'
import { ItemProduct } from '~/types/product.type'
import { ApiError } from '~/utils/api-error.util'
import { DiscountService } from './discount.service'
import { RedisService } from './redis.service'
import { OrderModel } from '~/models/order.model'
import { CheckoutRepo } from '~/repositories/checkout.repo'
import { OrderPayment } from '~/types'

interface ShopOrderIds {
  shop_id: string
  shop_discount: any[]
  item_products: ItemProduct[]
}

export class CheckoutService {
  /**
   *
   * @body
   * {
   *    cart_id: string,
   *    user_id: string,
   *    shop_order_ids: string[
   *        {
   *          shop_id: string,
   *          shop_discount: [],
   *          item_products: [{
   *            price,
   *            quantity,
   *            product_id,
   *          }]
   *        },
   *        {
   *          shop_id: string,
   *          shop_discount: [
   *              {
   *                shop_id,
   *                discount_id,
   *                code,
   *              }
   *          ],
   *          item_products: [{
   *            price,
   *            quantity,
   *            product_id,
   *          }]
   *        }
   *    ]
   * }
   */
  static async checkout({
    cart_id,
    user_id,
    shop_order_ids
  }: {
    cart_id: string
    user_id: string
    shop_order_ids: ShopOrderIds[]
  }) {
    try {
      const foundCart = await CartRepo.findCartById(cart_id)
      const checkout_order = {
        total_price: 0,
        fee_ship: 0,
        total_discount: 0,
        total_checkout: 0
      }
      const shop_order_ids_new = []

      // total bill
      for (let i = 0; i < shop_order_ids.length; i++) {
        const { shop_id, shop_discount = [], item_products = [] } = shop_order_ids[i]
        const checkProductServer = await ProductRepo.checkProductByServer(item_products)
        if (!checkProductServer[0]) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
        }

        // total price
        const checkoutPrice = checkProductServer.reduce((acc, cur) => {
          if (cur) {
            return acc + cur.price * cur.quantity
          }
          return acc
        }, 0)

        // total before handle discount
        checkout_order.total_price += checkoutPrice

        const itemCheckout = {
          shop_id,
          shop_discount,
          price_raw: checkoutPrice, // price before discount
          price_apply_discount: checkoutPrice, // price after discount
          item_products: checkProductServer
        }

        if (shop_discount.length > 0) {
          shop_discount.forEach(async (discounts) => {
            const { discount = 0 } = await DiscountService.getDiscountAmount({
              code: discounts.code,
              shop_id,
              user_id,
              products: checkProductServer as ItemProduct[]
            })

            checkout_order.total_discount += discount

            if (discount > 0) {
              itemCheckout.price_apply_discount = checkoutPrice - discount
            }
          })
        }

        checkout_order.total_checkout += itemCheckout.price_apply_discount
        shop_order_ids_new.push(itemCheckout)
      }

      return {
        shop_order_ids,
        shop_order_ids_new,
        checkout_order
      }
    } catch (error: any) {
      throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  static async orderByUser({
    shop_order_ids_new,
    cart_id,
    user_id,
    user_address = {},
    user_payment
  }: {
    shop_order_ids_new: any[]
    cart_id: string
    user_id: string
    user_address: any
    user_payment: OrderPayment
  }) {
    try {
      const { checkout_order } = await CheckoutService.checkout({
        cart_id,
        user_id,
        shop_order_ids: shop_order_ids_new
      })

      // check if product is out of stock or not
      const products = shop_order_ids_new.flatMap((order) => order.item_products)
      const acquireProduct = []
      for (let i = 0; i < products.length; i++) {
        const { product_id, quantity } = products[i]
        const keyLock = await RedisService.acquireLock({
          product_id,
          quantity,
          cart_id
        })
        acquireProduct.push(keyLock ? true : false)
        if (keyLock) {
          await RedisService.releaseLock(keyLock)
        }
      }

      // if product is out of stock
      if (acquireProduct.includes(false)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product is out of stock')
      }

      // create order
      return OrderModel.create({
        user: user_id,
        checkout: checkout_order,
        shipping: user_address,
        payment: user_payment,
        products: shop_order_ids_new
      })
    } catch (error: any) {
      throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  static async getOrdersByUser({ user_id, page, limit }: { user_id: string; page: number; limit: number }) {
    try {
      const filter = { user: user_id }
      const select = ['checkout', 'shipping', 'payment', 'products']

      return CheckoutRepo.getOrdersByUser({ filter, page, limit, select })
    } catch (error: any) {
      throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  static async getOrderByUser({ order_id, user_id }: { order_id: string; user_id: string }) {
    try {
      const filter = { _id: order_id, user: user_id }
      return CheckoutRepo.getOrderByUser({ filter, unSelect: ['__v'] })
    } catch (error: any) {
      throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  // static async cancelOrderByUser({ order_id, user_id }: { order_id: string; user_id: string }) {}

  // static async updateOrderStatusByShop({
  //   order_id,
  //   shop_id,
  //   status
  // }: {
  //   order_id: string
  //   shop_id: string
  //   status: string
  // }) {}
}
