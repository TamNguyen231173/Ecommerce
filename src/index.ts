import { DbService } from './dbs/init.mongodb'
import { WebService } from './services/web.service'

const main = async () => {
  try {
    await WebService.start()
    DbService.getInstance()
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
