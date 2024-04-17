import httpStatus from 'http-status'
import { ShopModel } from '~/models'
import { ApiError } from '~/utils/api-error.util'

export class ShopRepo {
  static findShopById(shop_id: string) {
    const foundShop = ShopModel.findById(shop_id)
    if (!foundShop) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found')
    }
    return foundShop
  }
}
