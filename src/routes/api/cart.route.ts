import { Router } from 'express'
import { CartController } from '~/controllers/cart.controller'

export const cartRouter = Router()

cartRouter.post('/add-to-cart', CartController.addToCart)
cartRouter.post('/add-to-cart-v2', CartController.addToCartV2)
cartRouter.post('/delete-product-from-cart', CartController.deleteProductFromCart)
cartRouter.get('/list-carts', CartController.getListCarts)
