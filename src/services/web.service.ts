import compression from 'compression'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from '~/configs'
import { errorHandler } from '~/middlewares/error.middleware'
import { requestIdMiddleware } from '~/middlewares/request-id.middleware'
import mainRouter from '~/routes'
import '~/tests/inventory.test'
import { AddressInfo } from 'net'
import { createServer } from 'http'

export class WebService {
  protected static app: Express = express()
  static port: string | number = config.port || 3000

  static async start() {
    this.useMiddlewares([
      express.json(),
      express.urlencoded({ extended: true }),
      helmet(),
      morgan(config.env === 'development' ? 'dev' : 'combined'),
      compression(),
      mainRouter,
      requestIdMiddleware,
      errorHandler
    ])

    const http = createServer(this.app)
    http.listen(this.port, () => {
      const address = http.address() as AddressInfo
      console.log(`Server running at http://localhost:${address.port}`)
    })
  }

  static useMiddlewares(middlewares = []) {
    for (const middleware of middlewares) {
      this.app.use(middleware)
    }
  }
}
