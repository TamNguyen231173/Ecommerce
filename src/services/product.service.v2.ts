import httpStatus from 'http-status'
import { ClothModel, ElectronicModel, ProductModel, ProductType } from '~/models/product'
import { ProductRepo } from '~/models/repositories/product.repo'
import { Shop } from '~/models/types/shop.type'
import { ApiError } from '~/utils/api-error.util'
import { Product as ProductInterface } from '../models/types/product.type'
import { removeEmpty, updateNestedObject } from '~/utils/filter.util'

export class ProductService {
  static productRegistry: {
    [key: string]: any
  } = {}

  static registerProductType(type: ProductType, productClass: typeof Cloth | typeof Electronic | typeof Furniture) {
    ProductService.productRegistry[type] = productClass
  }

  static async createProduct(type: ProductType, payload: any) {
    const productClass = ProductService.productRegistry[type]
    if (!productClass) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid product type')
    return new productClass(payload).createProduct()
  }

  static async updateProduct({ product_id, payload }: { product_id: string; payload: any }) {
    const product = await ProductRepo.findProductById({ product_id })
    if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
    const productClass = ProductService.productRegistry[product.type as ProductType]
    if (!productClass) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid product type')
    return new productClass(payload).updateProduct(product_id)
  }

  static async publishProductByShop({ shop_id, product_id }: { shop_id: string; product_id: string }) {
    return ProductRepo.publishProductByShop({ shop_id, product_id })
  }

  static async unPublishProductByShop({ shop_id, product_id }: { shop_id: string; product_id: string }) {
    return ProductRepo.unPublishProductByShop({ shop_id, product_id })
  }

  static async findAllDraftsForShop({
    shop_id,
    limit = 50,
    skip = 0
  }: {
    shop_id: string
    limit?: number
    skip?: number
  }) {
    const query = { shop: shop_id, isDraft: true }
    return ProductRepo.queryProducts({ query, limit, skip })
  }

  static async findAllPublishedProductsForShop({
    shop_id,
    limit = 50,
    skip = 0
  }: {
    shop_id: string
    limit?: number
    skip?: number
  }) {
    const query = { shop: shop_id, isPublished: true }
    return ProductRepo.queryProducts({ query, limit, skip })
  }

  static async searchProducts({
    keySearch,
    limit = 50,
    skip = 0
  }: {
    keySearch: string
    limit?: number
    skip?: number
  }) {
    return ProductRepo.searchProductByUser({ keySearch, limit, skip })
  }

  static async findAllProducts({
    sort = 'ctime',
    limit = 50,
    page = 1,
    filter = { isPublished: true },
    select = 'name price description thumb quantity type shop'
  }: {
    sort: string
    limit?: number
    page?: number
    filter: any
    select: string
  }) {
    return ProductRepo.findAllProducts({ limit, page, sort, filter, select })
  }

  static async findProductById(product_id: string) {
    return ProductRepo.findProductById({
      product_id,
      unSelect: ['__v']
    })
  }
}

// Define base product class
class Product {
  name?: string
  price?: number
  description?: string
  thumb?: string
  quantity?: number
  type?: string
  shop?: Shop
  attributes?: any

  constructor({ name, price, description, thumb, quantity, type, shop, attributes }: ProductInterface) {
    this.name = name
    this.price = price
    this.description = description
    this.thumb = thumb
    this.quantity = quantity
    this.type = type
    this.shop = shop
    this.attributes = attributes
  }

  async createProduct(product_id: string) {
    return ProductModel.create({
      ...this,
      _id: product_id
    })
  }

  async updateProduct(product_id: string, payload: any) {
    const productAfterRemoveEmpty = removeEmpty(payload)
    const productAfterUpdateNested = updateNestedObject(productAfterRemoveEmpty)
    return ProductRepo.updateProductById({
      product_id,
      payload: productAfterUpdateNested,
      model: ProductModel
    })
  }
}

// Define sub-class for different product types Cloth
class Cloth extends Product {
  brand?: string
  size?: string
  material?: string

  constructor({ brand, size, material, name, price, description, thumb, quantity, type, shop, attributes }: Cloth) {
    super({ name, price, description, thumb, quantity, type, shop, attributes })
    this.brand = brand
    this.size = size
    this.material = material
  }

  async createProduct() {
    console.log('this.attributes: ', this.attributes)
    const newCloth = await ClothModel.create({
      ...this.attributes,
      shop: this.shop
    })
    if (!newCloth) throw new Error('Cannot create new cloth')

    const newProduct = await super.createProduct(newCloth._id)
    if (!newProduct) throw new Error('Cannot create new product')

    return newProduct
  }

  async updateProduct(product_id: string) {
    if (this.attributes) {
      await ProductRepo.updateProductById({
        product_id,
        payload: this.attributes,
        model: ClothModel
      })
    }
    console.log('this: ', this)
    return super.updateProduct(product_id, this)
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  manufacturer?: string
  modelName?: string
  color?: string

  constructor({
    manufacturer,
    modelName,
    color,
    name,
    price,
    description,
    thumb,
    quantity,
    type,
    shop,
    attributes
  }: Electronic) {
    super({ name, price, description, thumb, quantity, type, shop, attributes })
    this.manufacturer = manufacturer
    this.modelName = modelName
    this.color = color
  }

  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.attributes,
      shop: this.shop
    })
    if (!newElectronic) throw new Error('Cannot create new cloth')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new Error('Cannot create new product')

    return newProduct
  }

  async updateProduct(product_id: string) {
    if (this.attributes) {
      await ProductRepo.updateProductById({
        product_id,
        payload: this.attributes,
        model: ElectronicModel
      })
    }

    return super.updateProduct(product_id, this)
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  manufacturer?: string
  modelName?: string
  color?: string

  constructor({
    manufacturer,
    modelName,
    color,
    name,
    price,
    description,
    thumb,
    quantity,
    type,
    shop,
    attributes
  }: Electronic) {
    super({ name, price, description, thumb, quantity, type, shop, attributes })
    this.manufacturer = manufacturer
    this.modelName = modelName
    this.color = color
  }

  async createProduct() {
    const newFur = await ElectronicModel.create({
      ...this.attributes,
      shop: this.shop
    })
    if (!newFur) throw new Error('Cannot create new cloth')

    const newProduct = await super.createProduct(newFur._id)
    if (!newProduct) throw new Error('Cannot create new product')

    return newProduct
  }

  async updateProduct(product_id: string) {
    if (this.attributes) {
      await ProductRepo.updateProductById({
        product_id,
        payload: this.attributes,
        model: ElectronicModel
      })
    }

    return super.updateProduct(product_id, this)
  }
}

// Register product types
ProductService.registerProductType(ProductType.CLOTH, Cloth)
ProductService.registerProductType(ProductType.ELECTRONIC, Electronic)
ProductService.registerProductType(ProductType.FURNITURE, Furniture)
