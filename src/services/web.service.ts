import express, { Express } from 'express'
import { config } from '~/configs'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import mainRouter from '~/routes'
import { errorHandler } from '~/middlewares/error.middleware'

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
    this.app.use(errorHandler)

    const httpServer = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`)
    })

    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${this.port} is already in use`)
        // You can add code here to handle the error, e.g. try a different port
      } else {
        throw error
      }
    })

    return httpServer
  }
}
