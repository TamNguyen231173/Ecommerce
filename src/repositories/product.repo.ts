import { result } from 'lodash'
import { ProductModel } from '../models/product'
import { QueryFilter, getUnSelectData } from '~/utils/filter.util'
import { Document, Model, Types } from 'mongoose'
import { ItemProduct } from '../types/product.type'

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

  static async findAllProducts({
    sort = 'ctime',
    limit,
    page,
    filter,
    select
  }: {
    sort: string
    limit: number
    page: number
    filter: QueryFilter
    select: string
  }) {
    const skip = (page - 1) * limit
    const sortBy: Record<string, -1 | 1> = sort === 'ctime' ? { createdAt: -1 } : { updatedAt: -1 }

    return ProductModel.find(filter, select).sort(sortBy).skip(skip).limit(limit).lean().exec()
  }

  static async findProductById({ product_id, unSelect }: { product_id: string; unSelect?: string[] }) {
    return ProductModel.findById(product_id).select(getUnSelectData(unSelect)).lean().exec()
  }

  static async updateProductById<TDocument extends Document, T>({
    product_id,
    payload,
    model,
    isNew = true
  }: {
    product_id: string
    payload: any
    model: Model<
      TDocument,
      {},
      {},
      {},
      Document<unknown, {}, TDocument> &
        T & {
          _id: Types.ObjectId
        },
      any
    >
    isNew?: boolean
  }) {
    return model.findOneAndUpdate({ _id: product_id }, payload, { new: isNew }).lean().exec()
  }

  static async getProductById(product_id: string) {
    return ProductModel.findById(product_id).lean().exec()
  }

  static async checkProductByServer(products: ItemProduct[]) {
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const foundProduct = await ProductModel.findById(product.product_id).lean().exec()
        if (foundProduct) {
          return {
            price: foundProduct.price,
            quantity: product.quantity,
            product_id: product.product_id
          }
        }
      })
    )

    // Filter out undefined values
    return productsWithDetails.filter((product) => product !== undefined)
  }
}
