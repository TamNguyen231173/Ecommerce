import mongoose from 'mongoose'
import { mongooseConfig } from '~/configs'
import { checkOverload } from '~/utils/check-connect'

export class DbService {
  private static instance: DbService

  constructor() {
    this.connect()
  }

  connect(type = 'mongo') {
    // if (config.env === 'development') {
    //   mongoose.set('debug', true)
    //   mongoose.set('debug', { color: true })
    // }

    if (!mongoose.connections[0].readyState) {
      mongoose
        .connect(mongooseConfig.uri)
        .then(() => {
          console.log('Connected to MongoDB')
          // checkOverload()
        })
        .catch((err) => console.log(err))
    }
  }

  static getInstance() {
    if (!DbService.instance) {
      DbService.instance = new DbService()
    }

    return DbService.instance
  }
}
