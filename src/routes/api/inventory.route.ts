import { Router } from 'express'
import { InventoryController } from '~/controllers/inventory.controller'

export const inventoryRouter = Router()

inventoryRouter.post('/shop/:shop_id/:product_id/add-stock', InventoryController.addStock)
