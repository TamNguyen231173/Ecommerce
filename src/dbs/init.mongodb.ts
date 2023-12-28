import mongoose from 'mongoose'
import { config, mongooseConfig } from '~/configs'
import { checkOverload } from '~/helpers/check.connect'

export class DbService {
  private static instance: DbService

  constructor() {
    this.connect()
  }

  connect(type = 'mongo') {
    if (config.env === 'development') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(mongooseConfig.uri)
      .then(() => {
        console.log('Connected to MongoDB')
        checkOverload()
      })
      .catch((err) => console.log(err))
  }

  static getInstance() {
    if (!DbService.instance) {
      DbService.instance = new DbService()
    }

    return DbService.instance
  }
}
