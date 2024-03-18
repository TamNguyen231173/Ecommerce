import { ShopModel } from '~/models/account/shop.model'

export interface options {
  select: {
    [key: string]: number
  }
}

export class ShopService {
  static async findByEmail(
    email: string,
    options: options = {
      select: {
        email: 1,
        password: 2,
        name: 1,
        status: 1,
        roles: 1
      }
    }
  ) {
    return ShopModel.findOne({ email }).select(options.select).lean()
  }
}
