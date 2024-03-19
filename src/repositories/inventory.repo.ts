import { InventoryModel } from '../models/inventory.model'
import { Inventory } from '../types/inventory.type'

export class InventoryRepo {
  static async insertInventory(payload: Inventory) {
    return await InventoryModel.create(payload)
  }

  static async reserveInventory({
    product_id,
    quantity,
    cart_id
  }: {
    product_id: string
    quantity: number
    cart_id: string
  }) {
    const query = {
      product: product_id,
      stock: { $gte: quantity }
    }
    const updateSet = {
      $inc: { stock: -quantity },
      push: {
        reservations: {
          cart_id,
          quantity,
          create_on: new Date()
        }
      }
    }
    const options = { new: true, upsert: true }
    return InventoryModel.findOneAndUpdate(query, updateSet, options)
  }
}
