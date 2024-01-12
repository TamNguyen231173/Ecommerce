"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_v2_1 = require("~/services/product.service.v2");
class ProductController {
    static async create(req, res) {
        req.body = {
            ...req.body,
            shop: req.user._id
        };
        const data = await product_service_v2_1.ProductService.createProduct(req.body.type, req.body);
        return res.status(201).json({
            message: 'Create product successfully',
            data
        });
    }
    static async getAllDraftsForShop(req, res) {
        const data = await product_service_v2_1.ProductService.findAllDraftsForShop({
            shop_id: req.user._id
        });
        return res.status(200).json({
            message: 'Get all drafts successfully',
            data
        });
    }
    static async publishProductByShop(req, res) {
        const data = await product_service_v2_1.ProductService.publishProductByShop({
            shop_id: req.user._id,
            product_id: req.params.id
        });
        return res.status(200).json({
            message: 'Publish product successfully',
            data
        });
    }
    static async unPublishProductByShop(req, res) {
        const data = await product_service_v2_1.ProductService.unPublishProductByShop({
            shop_id: req.user._id,
            product_id: req.params.id
        });
        return res.status(200).json({
            message: 'Unpublish product successfully',
            data
        });
    }
    static async getAllPublishedForShop(req, res) {
        const data = await product_service_v2_1.ProductService.findAllPublishedProductsForShop({
            shop_id: req.user._id
        });
        return res.status(200).json({
            message: 'Get all published products successfully',
            data
        });
    }
    static async getAllProducts(req, res) {
        const data = await product_service_v2_1.ProductService.findAllProducts({
            sort: req.query.sort,
            limit: Number(req.query.limit),
            page: Number(req.query.page),
            filter: req.query.filter,
            select: req.query.select
        });
        return res.status(200).json({
            message: 'Get all products successfully',
            data
        });
    }
    static async getProductById(req, res) {
        const data = await product_service_v2_1.ProductService.findProductById(req.params.id);
        return res.status(200).json({
            message: 'Get product successfully',
            data
        });
    }
    static async searchProducts(req, res) {
        const data = await product_service_v2_1.ProductService.searchProducts({
            keySearch: req.query.q
        });
        return res.status(200).json({
            message: 'Search products successfully',
            data
        });
    }
    static async updateProductById(req, res) {
        const data = await product_service_v2_1.ProductService.updateProduct({
            product_id: req.params.id,
            payload: req.body
        });
        return res.status(200).json({
            message: 'Update product successfully',
            data
        });
    }
}
exports.ProductController = ProductController;
