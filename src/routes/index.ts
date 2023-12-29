import { Router } from 'express'
import apiRouter from './api'
import { apiKey } from '~/middlewares/apiKey.middleware'
import { permission } from '~/middlewares/apiKey.middleware'
import { ApiKeyService } from '~/services/apiKey.service'

const mainRouter = Router()

mainRouter.get('/', (req, res) => {
  res.send('Welcome to EA SPORT!')
})

// mainRouter.post('/create-api-key', async (req, res) => {
//   const apiKey = await ApiKeyService.createKey()

//   res.send(apiKey)
// })

mainRouter.use(apiKey)
mainRouter.use(permission('0000'))

mainRouter.use('/api/v1', apiRouter)

export default mainRouter
