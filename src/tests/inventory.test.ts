import { RedisPubSubService } from '~/services/redisPubSub.service'

export class InventoryServiceTest {
  constructor() {
    RedisPubSubService.subscribe('product:purchase', (channel, message) => {
      const { product_id, quantity } = JSON.parse(message)
      InventoryServiceTest.updateInventory({ product_id, quantity })
    })
  }

  static updateInventory({ product_id, quantity }: { product_id: string; quantity: number }) {
    console.log(`Updating inventory for product ${product_id} by ${quantity}`)
  }
}
