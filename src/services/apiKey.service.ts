import { ApiKeyModel } from '~/models/apikey.model'

export class ApiKeyService {
  static async findById(key: string) {
    return ApiKeyModel.findOne({ key, status: true }).lean()
  }
}
