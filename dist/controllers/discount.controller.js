"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountController = void 0;
const discount_service_1 = require("~/services/discount.service");
class DiscountController {
    static async createDiscountCode(req, res) {
        const data = await discount_service_1.DiscountService.createDiscountCode(req.user, req.body);
        res.status(201).json({
            message: 'Discount code created successfully',
            data
        });
    }
    static async getAllProductsWithDiscountCode(req, res) {
        const data = await discount_service_1.DiscountService.getAllProductsWithDiscountCode({
            shop_id: req.params.shop_id,
            discount_code: req.body.discount_code
        });
        res.status(200).json({
            message: 'Get all discount codes successfully',
            data
        });
    }
    static async getAllDiscountsCodeByShop(req, res) {
        const data = await discount_service_1.DiscountService.getAllDiscountsByShop({
            shop_id: req.params.shop_id,
            limit: Number(req.query.limit),
            page: Number(req.query.page),
            sort: req.query.sort
        });
        res.status(200).json({
            message: 'Get all discount codes successfully',
            data
        });
    }
    static async getDiscountAmount(req, res) {
        const data = await discount_service_1.DiscountService.getDiscountAmount({
            shop_id: req.params.shop_id,
            user_id: req.user._id,
            code: req.body.discount_code,
            products: req.body.products
        });
        res.status(200).json({
            message: 'Get discount amount successfully',
            data
        });
    }
    static async deleteDiscountCode(req, res) {
        await discount_service_1.DiscountService.deleteDiscountCode({
            shop_id: req.user._id,
            discount_id: req.params.discount_id
        });
        res.status(200).json({
            message: 'Delete discount code successfully'
        });
    }
    static async cancelDiscountCode(req, res) {
        await discount_service_1.DiscountService.cancelDiscountCode({
            shop_id: req.params.shop_id,
            discount_id: req.params.discount_id,
            user_id: req.user._id
        });
        res.status(200).json({
            message: 'Cancel discount code successfully'
        });
    }
}
exports.DiscountController = DiscountController;
