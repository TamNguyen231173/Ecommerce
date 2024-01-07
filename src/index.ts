import { DbService } from './dbs/init.mongodb'
import { RedisPubSubService } from './services/redisPubSub.service'
import { WebService } from './services/web.service'

const main = async () => {
  try {
    await WebService.start()
    await DbService.getInstance()
    await RedisPubSubService.getInstance()
    // await RedisPubSubService.runTest()
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
