import { DbService } from './dbs/init.mongodb'
import { RedisService } from './services/redis.service'
import { WebService } from './services/web.service'
import ioredis from '~/dbs/init.ioredis'
import elasticsearch from '~/dbs/init.elasticsearch'

const main = async () => {
  try {
    await WebService.start()
    await DbService.getInstance()
    await RedisService.initRedis()
    await elasticsearch.init({ IS_ELASTICSEARCH_ENABLED: true })
    await ioredis.init({ IS_IOREDIS_ENABLED: true })
    // await RedisPubSubService.getInstance()
    // await RedisPubSubService.runTest()
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
