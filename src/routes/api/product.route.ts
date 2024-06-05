import { Router } from 'express'
import { ProductController } from '~/controllers/product.controller'
import { authentication } from '~/middlewares/auth.middleware'
import { readCache } from '~/middlewares/cache.middleware'

export const productRouter = Router()

// Customer
productRouter.get('/search', ProductController.searchProducts)
productRouter.get('/all', ProductController.getAllProducts)
productRouter.get('/:id', ProductController.getProductById)
// Shop
productRouter.use(authentication)
productRouter.post('/spu/new', ProductController.createSpu)
productRouter.get('/spu/:id', ProductController.findOneSpu)
productRouter.get('/sku/select-variation', readCache, ProductController.findOneSku)
productRouter.post('/create', ProductController.create)
productRouter.patch('/update/:id', ProductController.updateProductById)
productRouter.get('/draft/all', ProductController.getAllDraftsForShop)
productRouter.get('/published/all', ProductController.getAllPublishedForShop)
productRouter.patch('/publish/:id', ProductController.publishProductByShop)
productRouter.patch('/unpublish/:id', ProductController.unPublishProductByShop)
