import { DbService } from './dbs/init.mongodb'
import { RedisService } from './services/redis.service'
import { WebService } from './services/web.service'

const main = async () => {
  try {
    await WebService.start()
    await DbService.getInstance()
    await RedisService.initRedis()
    // await RedisPubSubService.getInstance()
    // await RedisPubSubService.runTest()
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
