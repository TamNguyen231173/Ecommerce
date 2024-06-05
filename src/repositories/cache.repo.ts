import ioredis from '~/dbs/init.ioredis'
import Redis from 'ioredis'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'

class CacheRepo {
  private cache: Redis = ioredis.getClient()

  async setCacheIO(key: string, value: any) {
    try {
      return await this.cache.set(key, JSON.stringify(value))
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error setting cache')
    }
  }

  async setCacheIOExpiration(key: string, value: any, expiration: number) {
    try {
      return await this.cache.set(key, JSON.stringify(value), 'EX', expiration) // expiration in seconds
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error setting cache expiration')
    }
  }

  async getCacheIO(key: string) {
    try {
      const data = await this.cache.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error getting cache')
    }
  }
}

const cacheRepo = new CacheRepo()
export default cacheRepo
