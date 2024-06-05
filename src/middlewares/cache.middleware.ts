import { NextFunction, Request, Response } from 'express'
import { CACHE_PRODUCT } from '~/configs/constant'
import cacheRepo from '~/repositories/cache.repo'
import httpStatus from 'http-status'

export const readCache = async (req: Request, res: Response, next: NextFunction) => {
  const { sku_id } = req.query
  const skuKeyCache = `${CACHE_PRODUCT}${sku_id}`

  const cache = await cacheRepo.getCacheIO(skuKeyCache)
  if (cache) {
    return res.status(httpStatus.OK).json({
      ...JSON.parse(cache),
      fromCache: true
    })
  }
  next()
}