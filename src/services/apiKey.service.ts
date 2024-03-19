import { ApiKeyModel } from '~/models/apikey.model'

export class ApiKeyService {
  static async createKey() {
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return ApiKeyModel.create({
      key,
      status: true
    })
  }

  static async findById(key: string) {
    return ApiKeyModel.findOne({ key, status: true }).lean()
  }
}
