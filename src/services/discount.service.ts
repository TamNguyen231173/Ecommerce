import httpStatus from 'http-status'
import { Types } from 'mongoose'
import { DiscountModel } from '~/models/discount.model'
import { DiscountRepo } from '~/models/repositories/discount.repo'
import { ProductRepo } from '~/models/repositories/product.repo'
import { ShopModel } from '~/models/shop.model'
import { Discount } from '~/models/types/discount.type'
import { ApiError } from '~/utils/api-error.util'
import { Product } from '~/models/types/product.type'
import { QueryFilter } from '~/utils/filter.util'

export class DiscountService {
  static async createDiscountCode(shop_id: string, payload: Discount) {
    const { start_date, end_date } = payload
    const today = new Date()
    const isStartDateValid = today < new Date(start_date)
    const isEndDateValid = today < new Date(end_date)
    const isDateRangeValid = new Date(start_date) < new Date(end_date)

    if (isStartDateValid || isEndDateValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date range')
    }
    if (!isDateRangeValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date range')
    }

    const foundDiscount = await DiscountModel.findOne({ code: payload.code, shop: payload.shop }).lean()
    if (foundDiscount) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Discount code already exists')
    }

    return DiscountModel.create({
      ...payload,
      shop: shop_id
    })
  }

  static async getAllProductsWithDiscountCode({
    shop_id,
    discount_code,
    limit = 50,
    page = 1,
    sort = 'ctime'
  }: {
    shop_id: string
    discount_code: string
    limit?: number
    page?: number
    sort?: string
  }) {
    const foundDiscount = await DiscountRepo.checkDiscountCodeExists({ code: discount_code, shop_id })

    const { applies_to, product_ids } = foundDiscount
    const select = 'name description price images shop isPublished isDraft'
    let filter: QueryFilter = { shop: shop_id, isPublished: true }

    if (applies_to === 'product') {
      filter = { ...filter, _id: { $in: product_ids } }
    }

    return ProductRepo.findAllProducts({
      filter,
      limit,
      page,
      sort,
      select
    })
  }

  static async getAllDiscountsByShop({
    shop_id,
    limit = 50,
    page = 1,
    sort = 'ctime'
  }: {
    shop_id: string
    limit?: number
    page?: number
    sort?: string
  }) {
    const shop = await ShopModel.findOne({ _id: new Types.ObjectId(shop_id) }).lean()
    if (!shop) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found')
    }

    return DiscountRepo.getAllDiscounts({
      filter: { shop: shop_id },
      select: ['name', 'description', 'code', 'start_date', 'end_date', 'applies_to', 'product_ids'],
      limit,
      page,
      sort
    })
  }

  static async getDiscountAmount({
    code,
    user_id,
    shop_id,
    products
  }: {
    code: string
    user_id: string
    shop_id: string
    products: Partial<Product>[]
  }) {
    const foundDiscount = await DiscountRepo.checkDiscountCodeExists({ code, shop_id })
    const {
      value,
      min_order_value,
      is_active,
      discount_limit,
      start_date,
      end_date,
      max_used_per_user,
      user_used,
      type
    } = foundDiscount

    if (!is_active) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Discount code is inactive')
    }
    if (discount_limit === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Discount code is out of stock')
    }
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Discount code is expired')
    }

    let totalOrder = 0
    if (min_order_value && min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        if (product.quantity && product.price) {
          return acc + product.quantity * product.price
        }
        return acc
      }, 0)

      if (totalOrder < min_order_value) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Discount code is not applicable')
      }
    }

    if (max_used_per_user && max_used_per_user > 0) {
      const userDiscountedCount = user_used.filter((user: string) => user === user_id).length
      if (userDiscountedCount >= max_used_per_user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Discount code is not applicable')
      }
    }

    const amount = type === 'percentage' ? (totalOrder * value) / 100 : value

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shop_id, discount_id }: { shop_id: string; discount_id: string }) {
    const discountCode = await DiscountModel.findOneAndDelete({ _id: discount_id, shop: shop_id })
    if (!discountCode) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount code not found')
    }
    return discountCode
  }

  static async cancelDiscountCode({
    shop_id,
    discount_id,
    user_id
  }: {
    shop_id: string
    discount_id: string
    user_id: string
  }) {
    const foundDiscount = DiscountModel.findOne({ _id: discount_id, shop: shop_id }).lean()
    if (!foundDiscount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount code not found')
    }

    return DiscountModel.findOneAndUpdate(
      { _id: discount_id, shop: shop_id },
      { $pull: { user_used: user_id } },
      { new: true }
    ).lean()
  }
}
