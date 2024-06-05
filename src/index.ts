import { DbService } from './dbs/init.mongodb'
import { elasticSearchService } from './services/elasticSearch.service'
import { RedisService } from './services/redis.service'
import { WebService } from './services/web.service'
import ioredis from '~/dbs/init.ioredis'

const main = async () => {
  try {
    await WebService.start()
    await DbService.getInstance()
    await RedisService.initRedis()
    await elasticSearchService.init({ IS_ELASTICSEARCH_ENABLED: true })
    await ioredis.init({ IS_IOREDIS_ENABLED: true })
    // await RedisPubSubService.getInstance()
    // await RedisPubSubService.runTest()
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
