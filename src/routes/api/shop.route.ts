import { Router } from 'express'
import 'express-async-errors'

export const shopRouter = Router()

shopRouter.get('/', (req, res) => {
  res.send('Welcome to EA SPORT SHOP!')
})

export default shopRouter
