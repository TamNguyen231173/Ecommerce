import { SpuModel } from '~/models/spu.model'
import { ShopRepo } from '~/repositories/shop.repo'
import { SpuCreatePayload } from '~/types'
import { SkuService } from './sku.service'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'
import _ from 'lodash'

export class SpuService {
  static async newSpu(payload: SpuCreatePayload) {
    const foundShop = await ShopRepo.findShopById(payload.shop)

    const newSpu = SpuModel.create({ ...payload, shop: foundShop })

    if (newSpu && payload.sku_list.length > 0) {
      payload.sku_list.forEach(async (sku) => {
        await SkuService.newSku(sku)
      })
    }

    // sync data via elastic search (search service)

    return newSpu
  }

  static async findOneSpu(spu_id: string) {
    const spu = await SpuModel.findOne({ _id: spu_id, isPublished: true }).lean()

    if (!spu) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Spu not found')
    }

    const skus = await SkuService.finAllSkusByProduct(spu._id)

    return {
      spu_info: _.omit(spu, ['_v', 'updatedAt', 'createdAt', 'shop']),
      sku_list: skus
    }
  }
}
