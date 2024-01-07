import { RedisPubSubService } from '~/services/redisPubSub.service'

export class ProductServiceTest {
  static async purchaseProduct({ product_id, quantity }: { product_id: string; quantity: number }) {
    const order = { product_id, quantity }

    RedisPubSubService.publish('product:purchase', JSON.stringify(order))
  }
}
