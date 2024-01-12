"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("~/services/cart.service");
class CartController {
    static async addToCart(req, res) {
        const data = await cart_service_1.CartService.addToCart({
            user_id: req.user._id,
            product: req.body.product
        });
        res.status(200).json({
            message: 'Add to cart successfully',
            data
        });
    }
    static async addToCartV2(req, res) {
        const data = await cart_service_1.CartService.addToCartV2({
            user_id: req.user._id,
            shop_order_ids: req.body.shop_order_ids
        });
        res.status(200).json({
            message: 'Add to cart successfully',
            data
        });
    }
    static async deleteProductFromCart(req, res) {
        const data = await cart_service_1.CartService.deleteProductFromCart({
            user_id: req.user._id,
            product_ids: req.body.products
        });
        res.status(200).json({
            message: 'Delete product from cart successfully',
            data
        });
    }
    static async getListCarts(req, res) {
        const data = await cart_service_1.CartService.getListCarts(req.user._id);
        res.status(200).json({
            message: 'Get list carts successfully',
            data
        });
    }
}
exports.CartController = CartController;
