import { Request, Response } from 'express'
import { InventoryService } from '~/services/inventory.service'

export class InventoryController {
  static async addStock(req: Request, res: Response) {
    const data = await InventoryService.addStockToInventory({
      product_id: req.params.product_id,
      stock: req.body.stock,
      shop_id: req.params.shop_id,
      location: req.body.location
    })
    res.status(200).json({
      message: 'Add stock successfully',
      data
    })
  }
}
