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
}
