import * as redis from 'redis'
import { promisify } from 'util'
import { config } from '~/configs'
import { RedisStatus } from '~/enums/redis.enum'
import { InventoryRepo } from '~/repositories/inventory.repo'
import { ApiError } from '~/utils/api-error.util'

interface LockDto {
  product_id: string
  quantity: number
  cart_id: string
}

const REDIS_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: 'Redis connection timeout'
}

export class RedisService {
  private static redisClient = redis.createClient({
    url: config.redis.url
  })
  private static pexpire = promisify(RedisService.redisClient.pExpire).bind(this.redisClient)
  private static setnxAsync = promisify(RedisService.redisClient.setNX).bind(this.redisClient)
  private static connectionTimeout = null

  static async initRedis() {
    await this.redisClient.connect()
    await this.handleEventConnect()
  }

  static async handleEventConnect() {
    try {
      const response = await RedisService.redisClient.ping()
      if (response === 'PONG') {
        console.log('Redis server is running')
      } else {
        console.log('Unexpected response from Redis:', response)
      }
    } catch (err) {
      console.error('Error pinging Redis:', err)
    }

    this.redisClient.on(RedisStatus.CONNECT, () => {
      console.log('Redis connected')
      clearTimeout(this.connectionTimeout)
    })

    this.redisClient.on(RedisStatus.ERROR, (error) => {
      console.error('Redis error', error)
    })

    this.redisClient.on(RedisStatus.END, () => {
      console.log('Redis end')
      // connect again
      this.handelTimeoutError()
    })

    this.redisClient.on(RedisStatus.RECONNECTING, () => {
      console.log('Redis reconnect')
    })
  }

  static async handelTimeoutError() {
    this.connectionTimeout = setTimeout(() => {
      throw new ApiError(REDIS_CONNECT_MESSAGE.code, REDIS_CONNECT_MESSAGE.message)
    }, REDIS_TIMEOUT)
  }

  static async closeConnection() {
    await this.redisClient.quit()
  }

  static async acquireLock({ product_id, quantity, cart_id }: LockDto) {
    const key = `lock_v_:${product_id}`
    const retryTimes = 10
    const expire = 3000

    for (let i = 0; i < retryTimes; i++) {
      const result = await this.setnxAsync(key, expire)
      if (result === 1) {
        // handle inventory
        const isReservation = await InventoryRepo.reserveInventory({ product_id, quantity, cart_id })

        if (isReservation?.isModified) {
          await this.pexpire(key, expire)
          return key
        }

        return null
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  static async releaseLock(key: string) {
    const delAsyncKey = promisify(this.redisClient.del).bind(this.redisClient)
    return delAsyncKey(key)
  }
}
