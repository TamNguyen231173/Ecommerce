import httpStatus from 'http-status'
import { SkuModel } from '~/models/sku.model'
import { ProductRepo } from '~/repositories/product.repo'
import { SkuCreatePayload } from '~/types'
import { ApiError } from '~/utils/api-error.util'
import _ from 'lodash'
import { CACHE_PRODUCT } from '~/configs/constant'
import cacheRepo from '~/repositories/cache.repo'

export class SkuService {

  static async newSku(payload: SkuCreatePayload) {
    const foundProduct = await ProductRepo.findProductById({ product_id: payload.product })

    const newSku = SkuModel.create({
      ...payload,
      product: foundProduct
    })

    return newSku
  }

  static async findOneSku(sku_id: string, product_id: string) {
    const sku = await SkuModel.findOne({ _id: sku_id, product: product_id }).lean()
    const skuKeyCache = `${CACHE_PRODUCT}${sku_id}`

    if (!sku) {
      // if sku not found, set cache with key and value null, expiration 60 seconds
      await cacheRepo.setCacheIOExpiration(skuKeyCache, null, 30)
      throw new ApiError(httpStatus.NOT_FOUND, 'Sku not found')
    }

    await cacheRepo.setCacheIO(skuKeyCache, JSON.stringify(sku))

    return _.omit(sku, ['_v', 'updatedAt', 'createdAt', 'product'])
  }

  static async finAllSkusByProduct(product_id: string) {
    const foundProduct = await ProductRepo.findProductById({ product_id })

    // read cache
    const skus = await SkuModel.find({ product: foundProduct._id }).lean()

    // save cache

    return skus.map((sku) => _.omit(sku, ['_v', 'updatedAt', 'createdAt', 'product']))
  }
}
