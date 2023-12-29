import { Router } from 'express'
import apiRouter from './api'

const mainRouter = Router()

mainRouter.get('/', (req, res) => {
  res.send('Welcome to EA SPORT!')
})
mainRouter.use('/api/v1', apiRouter)

export default mainRouter
