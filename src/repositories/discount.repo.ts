import { QueryFilter, getSelectData, getUnSelectData } from '~/utils/filter.util'
import { DiscountModel } from '../models/discount.model'
import { Types } from 'mongoose'
import httpStatus from 'http-status'
import { ApiError } from '~/utils/api-error.util'

export class DiscountRepo {
  static async getAllDiscounts({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter = {},
    select
  }: {
    limit?: number
    page?: number
    sort?: string
    filter?: QueryFilter
    select?: string[]
  }) {
    const skip = (page - 1) * limit
    const sortBy: Record<string, -1 | 1> = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return DiscountModel.find(filter)
      .sort(sortBy)
      .select(getSelectData(select))
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'product_ids',
        select: 'name'
      })
      .lean()
  }

  static async checkDiscountCodeExists({ code, shop_id }: { code: string; shop_id: string }) {
    const foundDiscount = await DiscountModel.findOne({ code, shop: new Types.ObjectId(shop_id) }).lean()

    if (!foundDiscount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount code not found')
    }

    return foundDiscount
  }
}
