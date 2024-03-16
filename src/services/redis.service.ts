import * as redis from 'redis'
import { promisify } from 'util'
import { InventoryRepo } from '~/repositories/inventory.repo'

export class RedisService {
  private static redisClient = redis.createClient()
  private static pexpire = promisify(RedisService.redisClient.pExpire).bind(this.redisClient)
  private static setnxAsync = promisify(RedisService.redisClient.setNX).bind(this.redisClient)

  static async acquireLock({
    product_id,
    quantity,
    cart_id
  }: {
    product_id: string
    quantity: number
    cart_id: string
  }) {
    const key = `lock_v_:${product_id}`
    const retryTimes = 10
    const expire = 3000

    for (let i = 0; i < retryTimes; i++) {
      const result = await this.setnxAsync(key, expire)
      if (result === 1) {
        // handle inventory
        const isReservation = await InventoryRepo.reserveInventory({
          product_id,
          quantity,
          cart_id
        })
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
