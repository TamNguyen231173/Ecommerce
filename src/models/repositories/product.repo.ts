import { result } from 'lodash'
import { ProductModel } from '../product'

export class ProductRepo {
  static publishProductByShop({ shop_id, product_id }: { shop_id: string; product_id: string }) {
    const foundShop = ProductModel.findOne({ _id: product_id, shop: shop_id })
    if (!foundShop) {
      throw new Error('Product not found')
    }
    return ProductModel.updateOne({ _id: product_id }, { isDraft: false, isPublished: true }, { new: true }).exec()
  }

  static unPublishProductByShop({ shop_id, product_id }: { shop_id: string; product_id: string }) {
    const foundShop = ProductModel.findOne({ _id: product_id, shop: shop_id })
    if (!foundShop) {
      throw new Error('Product not found')
    }
    return ProductModel.updateOne({ _id: product_id }, { isDraft: true, isPublished: false }, { new: true }).exec()
  }

  static async queryProducts({ query, limit, skip }: { query: any; limit: number; skip: number }) {
    return ProductModel.find(query)
      .populate('shop', 'name email -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
  }

  static async searchProductByUser({ keySearch, limit, skip }: { keySearch: string; limit: number; skip: number }) {
    const regexSearch = new RegExp(keySearch, 'i')
    return ProductModel.find(
      {
        $or: [{ name: { $regex: regexSearch } }, { description: { $regex: regexSearch } }],
        isDraft: false
      },
      null,
      { limit, skip }
    )
      .sort({ updatedAt: -1 })
      .lean()
  }
}
