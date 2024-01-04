import { Shop } from '~/models/types/shop.type'
import { Product as ProductInterface } from '../models/types/product.type'
import { ClothModel, ElectronicModel, ProductModel, ProductType } from '~/models/product'
import { ApiError } from '~/utils/api-error.util'
import httpStatus from 'http-status'

export class ProductService {
  static async createProduct(type: string, payload: any) {
    switch (type) {
      case ProductType.CLOTH:
        return new Cloth(payload).createProduct()
      case ProductType.ELECTRONIC:
        return new Electronic(payload).createProduct()
      default:
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid product type ${type}`)
    }
  }
}

// Define base product class
class Product {
  name: string
  price: number
  description?: string
  thumb?: string
  quantity: number
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
    const newCloth = await ClothModel.create({
      ...this.attributes,
      shop: this.shop
    })
    if (!newCloth) throw new Error('Cannot create new cloth')

    const newProduct = super.createProduct(newCloth._id)
    if (!newProduct) throw new Error('Cannot create new product')

    return newProduct
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

    const newProduct = super.createProduct(newElectronic._id)
    if (!newProduct) throw new Error('Cannot create new product')

    return newProduct
  }
}
