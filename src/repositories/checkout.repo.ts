import { QueryFilter, getSelectData, getUnSelectData } from '~/utils/filter.util'
import { OrderModel } from '../models/order.model'

export class CheckoutRepo {
  static async getOrdersByUser({
    page,
    limit,
    sort,
    select,
    filter
  }: {
    page: number
    limit: number
    sort?: string
    select: string[]
    filter: QueryFilter
  }) {
    const skip = (page - 1) * limit
    const sortBy: Record<string, -1 | 1> = sort === 'ctime' ? { createdAt: -1 } : { updatedAt: -1 }
    return OrderModel.find(filter).select(getSelectData(select)).sort(sortBy).skip(skip).limit(limit).lean().exec()
  }

  static async getOrderByUser({ filter, unSelect }: { filter: QueryFilter; unSelect: string[] }) {
    return OrderModel.findOne(filter).select(getUnSelectData(unSelect)).lean().exec()
  }
}
