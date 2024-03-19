import { Request, Response } from 'express'
import { DiscountService } from '~/services/discount.service'

export class DiscountController {
  static async createDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.createDiscountCode(req.user, req.body)
    res.status(201).json({
      message: 'Discount code created successfully',
      data
    })
  }

  static async getAllProductsWithDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.getAllProductsWithDiscountCode({
      shop_id: req.params.shop_id as string,
      discount_code: req.body.discount_code as string
    })
    res.status(200).json({
      message: 'Get all discount codes successfully',
      data
    })
  }

  static async getAllDiscountsCodeByShop(req: Request, res: Response) {
    const data = await DiscountService.getAllDiscountsByShop({
      shop_id: req.params.shop_id as string,
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      sort: req.query.sort as string
    })
    res.status(200).json({
      message: 'Get all discount codes successfully',
      data
    })
  }

  static async getDiscountAmount(req: Request, res: Response) {
    const data = await DiscountService.getDiscountAmount({
      shop_id: req.params.shop_id,
      user_id: req.user._id,
      code: req.body.discount_code,
      products: req.body.products
    })
    res.status(200).json({
      message: 'Get discount amount successfully',
      data
    })
  }

  static async deleteDiscountCode(req: Request, res: Response) {
    await DiscountService.deleteDiscountCode({
      shop_id: req.user._id,
      discount_id: req.params.discount_id
    })
    res.status(200).json({
      message: 'Delete discount code successfully'
    })
  }

  static async cancelDiscountCode(req: Request, res: Response) {
    await DiscountService.cancelDiscountCode({
      shop_id: req.params.shop_id,
      discount_id: req.params.discount_id,
      user_id: req.user._id
    })
    res.status(200).json({
      message: 'Cancel discount code successfully'
    })
  }
}
