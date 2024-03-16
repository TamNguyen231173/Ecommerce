export enum NotiType {
  ORDER_001 = 'ORDER_001', // Order created
  ORDER_002 = 'ORDER_002', // Order updated
  ORDER_003 = 'ORDER_003', // Order deleted
  ORDER_004 = 'ORDER_004', // Order status changed
  PROMOTION_001 = 'PROMOTION_001', // Promotion created
  PROMOTION_002 = 'PROMOTION_002', // Promotion updated
  PROMOTION_003 = 'PROMOTION_003', // Promotion deleted
  SHOP_001 = 'SHOP_001' // Add new product
}

export interface Notification {
  _id?: any
  type: NotiType
  sender: any
  receiver: any
  content: string
  options: object
}
