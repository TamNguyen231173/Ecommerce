import { QueryFilter } from '~/utils/filter.util'
import { CartModel } from '../cart.model'
import { Types } from 'mongoose'
import { Product } from '../types/product.type'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'

export class CartRepo {
  static async createUserCart({ user_id, product = {} }: { user_id: string; product: Partial<Product> }) {
    const filter: QueryFilter = { user: user_id, state: 'active' }
    const updateOrInsert = {
      $push: { products: product }
    }
    const options = { new: true, upsert: true }
    return CartModel.findOneAndUpdate(filter, updateOrInsert, options)
  }

  static async updateCartUserQuantity({ user_id, product = {} }: { user_id: string; product: Partial<Product> }) {
    console.log('product', product)
    const filter: QueryFilter = { user: user_id, state: 'active', 'products._id': product._id }
    const update = {
      $inc: { 'products.$.quantity': product.quantity }
    }
    const options = { new: true }
    return CartModel.findOneAndUpdate(filter, update, options)
  }

  static async deleteProductFromCart({ user_id, product_ids }: { user_id: string; product_ids: string[] }) {
    const filter: QueryFilter = { user: user_id, state: 'active' }
    const update = {
      $pull: { products: { _id: { $in: product_ids } } },
      $inc: { count_products: -1 }
    }
    const options = { new: true }
    return CartModel.findOneAndUpdate(filter, update, options)
  }

  static async getListCarts(user_id: string) {
    const filter: QueryFilter = { user: user_id, state: 'active' }
    return CartModel.findOne(filter).populate('products')
  }

  static async findCartById(cart_id: string) {
    const cart = await CartModel.findOne({ _id: new Types.ObjectId(cart_id), state: 'active' }).populate('products')
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found')
    }
    return cart
  }
}
