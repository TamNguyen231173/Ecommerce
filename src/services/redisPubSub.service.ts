import { RedisFunctions, RedisModules, RedisScripts } from '@redis/client'
import * as Redis from 'redis'
import { InventoryServiceTest } from '~/tests/inventory.test'
import { ProductServiceTest } from '~/tests/product.test'

export class RedisPubSubService {
  private static redisPublisher: Redis.RedisClientType<RedisModules, RedisFunctions, RedisScripts>
  private static redisSubscriber: Redis.RedisClientType<RedisModules, RedisFunctions, RedisScripts>

  static async runTest() {
    // Call the purchaseProduct method of ProductServiceTest to publish a 'product:purchase' event
    new InventoryServiceTest()
    // Create an instance of InventoryServiceTest to start listening to 'product:purchase' events
    await ProductServiceTest.purchaseProduct({ product_id: '1', quantity: 1 })
  }

  static async getInstance() {
    if (!RedisPubSubService.redisPublisher) {
      const publisher = Redis.createClient()
      await publisher.connect()
      RedisPubSubService.redisPublisher = publisher
    }

    if (!RedisPubSubService.redisSubscriber) {
      const subscriber = Redis.createClient()
      await subscriber.connect()
      RedisPubSubService.redisSubscriber = subscriber
    }
    console.log('Redis PubSub Service is ready')
    return { publisher: RedisPubSubService.redisPublisher, subscriber: RedisPubSubService.redisSubscriber }
  }

  static async publish(channel: string, message: string) {
    return RedisPubSubService.redisPublisher.publish(channel, message)
  }
  static subscribe(channel: string, callback: (channel: string, message: string) => void) {
    return RedisPubSubService.redisSubscriber.subscribe(channel, (message, channel) => {
      callback(channel, message)
    })
  }
}
