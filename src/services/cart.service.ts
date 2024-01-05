import httpStatus from 'http-status'
import { CartModel } from '~/models/cart.model'
import { CartRepo } from '~/models/repositories/cart.repo'
import { ProductRepo } from '~/models/repositories/product.repo'
import { ApiError } from '~/utils/api-error.util'

interface ShopOrder {
  shop_id: string
  item_products: {
    quantity: number
    old_quantity: number
    price: number
    shop_id: string
    product_id: string
  }[]
  version: number
}

export class CartService {
  static async addToCart({ user_id, product = {} }: { user_id: string; product: any }) {
    const userCart = await CartModel.findOne({ user: user_id })
    if (!userCart) {
      return CartRepo.createUserCart({ user_id, product })
    }
    if (!userCart.products.length) {
      userCart.products = [product]
      return userCart.save()
    }

    return CartRepo.updateCartUserQuantity({ user_id, product })
  }

  /**
   *
   * @body
   * {
   *  shop_oder_ids: [
   *    {
   *     shop_id,
   *     item_products: [
   *         {
   *            quantity,
   *            old_quantity,
   *            price,
   *            shop_id,
   *            product_id,
   *         }
   *     ],
   *     version
   *    }
   *  ]
   * }
   */
  static async addToCartV2({ user_id, shop_order_ids = [] }: { user_id: string; shop_order_ids: ShopOrder[] }) {
    console.log('shop_order_ids', shop_order_ids)
    for (const shop_order of shop_order_ids) {
      for (const item_product of shop_order.item_products) {
        const { product_id, quantity, old_quantity } = item_product

        const foundProduct = await ProductRepo.getProductById(product_id)
        if (!foundProduct) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
        }
        if (foundProduct.shop.toString() !== shop_order.shop_id) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Product not belong to shop')
        }
        if (foundProduct.quantity < quantity) {
          throw new ApiError(httpStatus.BAD_REQUEST, `Product ${foundProduct.name} is out of stock`)
        }

        if (quantity === 0) {
          await CartRepo.deleteProductFromCart({ user_id, product_ids: [product_id] })
        } else {
          await CartRepo.updateCartUserQuantity({
            user_id: user_id,
            product: {
              _id: product_id,
              quantity: quantity - old_quantity
            }
          })
        }
      }
    }

    const userCart = await CartRepo.getListCarts(user_id)
    return userCart
  }

  static async deleteProductFromCart({ user_id, product_ids }: { user_id: string; product_ids: string[] }) {
    return CartRepo.deleteProductFromCart({ user_id, product_ids })
  }

  static async getListCarts(user_id: string) {
    return CartRepo.getListCarts(user_id)
  }
}
