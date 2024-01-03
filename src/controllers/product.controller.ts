import { ProductService } from '~/services/product.service.v2'
import { Request, Response } from 'express'

export class ProductController {
  static async create(req: Request, res: Response) {
    req.body = {
      ...req.body,
      shop: req.user._id
    }
    const data = await ProductService.createProduct(req.body.type, req.body)
    return res.status(201).json({
      message: 'Create product successfully',
      data
    })
  }

  static async getAllDraftsForShop(req: Request, res: Response) {
    const data = await ProductService.findAllDraftsForShop({
      shop_id: req.user._id
    })
    return res.status(200).json({
      message: 'Get all drafts successfully',
      data
    })
  }

  static async publishProductByShop(req: Request, res: Response) {
    const data = await ProductService.publishProductByShop({
      shop_id: req.user._id,
      product_id: req.params.id
    })
    return res.status(200).json({
      message: 'Publish product successfully',
      data
    })
  }

  static async unPublishProductByShop(req: Request, res: Response) {
    const data = await ProductService.unPublishProductByShop({
      shop_id: req.user._id,
      product_id: req.params.id
    })
    return res.status(200).json({
      message: 'Unpublish product successfully',
      data
    })
  }

  static async getAllPublishedForShop(req: Request, res: Response) {
    const data = await ProductService.findAllPublishedProductsForShop({
      shop_id: req.user._id
    })
    return res.status(200).json({
      message: 'Get all published products successfully',
      data
    })
  }

  static async getAllProducts(req: Request, res: Response) {
    const data = await ProductService.findAllProducts({
      sort: req.query.sort as string,
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      filter: req.query.filter,
      select: req.query.select as string
    })
    return res.status(200).json({
      message: 'Get all products successfully',
      data
    })
  }

  static async getProductById(req: Request, res: Response) {
    const data = await ProductService.findProductById(req.params.id)
    return res.status(200).json({
      message: 'Get product successfully',
      data
    })
  }

  static async searchProducts(req: Request, res: Response) {
    const data = await ProductService.searchProducts({
      keySearch: req.query.q as string
    })
    return res.status(200).json({
      message: 'Search products successfully',
      data
    })
  }

  static async updateProductById(req: Request, res: Response) {
    const data = await ProductService.updateProduct({
      product_id: req.params.id,
      payload: req.body
    })
    return res.status(200).json({
      message: 'Update product successfully',
      data
    })
  }
}
