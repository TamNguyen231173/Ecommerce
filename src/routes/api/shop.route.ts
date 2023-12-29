import { Router } from 'express'
import 'express-async-errors'

const shopRouter = Router()

shopRouter.get('/', (req, res) => {
  res.send('Welcome to EA SPORT SHOP!')
})

export default shopRouter
