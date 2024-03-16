import httpStatus from 'http-status'
import { InventoryModel } from '~/models/inventory.model'
import { ProductRepo } from '~/repositories/product.repo'
import { ApiError } from '~/utils/api-error.util'

export class InventoryService {
  static async addStockToInventory({
    stock,
    product_id,
    shop_id,
    location = 'HCM City'
  }: {
    stock: number
    product_id: string
    shop_id: string
    location?: string
  }) {
    const product = await ProductRepo.findProductById({
      product_id,
      unSelect: ['_id', 'name', 'price', 'quantity', 'shop_id']
    })
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
    }

    const query = { shop: shop_id, product: product_id }
    const update = {
      $inc: { quantity: stock },
      $set: { location }
    }
    const options = { upsert: true, new: true }
    return InventoryModel.findOneAndUpdate(query, update, options)
  }
}
