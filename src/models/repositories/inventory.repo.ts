import { InventoryModel } from '../inventory.model'
import { Inventory } from '../types/inventory.type'

export class InventoryRepo {
  static async insertInventory(payload: Inventory) {
    return await InventoryModel.create(payload)
  }
}
