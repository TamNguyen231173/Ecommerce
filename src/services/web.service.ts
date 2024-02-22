import compression from 'compression'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from '~/configs'
import { errorHandler } from '~/middlewares/error.middleware'
import { requestIdMiddleware } from '~/middlewares/request-id.middleware'
import mainRouter from '~/routes'
import '~/tests/inventory.test'

export class WebService {
  protected static app: Express
  static port: string | number = config.port || 3000

  static async start() {
    this.app = express()

    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(helmet())
    this.app.use(morgan(config.env === 'development' ? 'dev' : 'combined'))
    this.app.use(compression())
    this.app.use(mainRouter)
    this.app.use(requestIdMiddleware)
    this.app.use(errorHandler)

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`)
    })
  }
}
