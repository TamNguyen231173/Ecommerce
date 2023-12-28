import express, { Express } from 'express'
import { config } from '~/configs'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'

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

    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`)
    })
  }
}
