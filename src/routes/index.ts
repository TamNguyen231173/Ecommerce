import { Router } from 'express'
import apiRouter from './api'
import { apiKey } from '~/middlewares/apiKey.middleware'
import { permission } from '~/middlewares/apiKey.middleware'

const mainRouter = Router()

mainRouter.get('/', (req, res) => {
  res.send('Welcome to EA SPORT!')
})

mainRouter.use(apiKey)
mainRouter.use(permission('0000'))

mainRouter.use('/api/v1', apiRouter)

export default mainRouter
