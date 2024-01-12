"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cart_model_1 = require("~/models/cart.model");
const cart_repo_1 = require("~/models/repositories/cart.repo");
const product_repo_1 = require("~/models/repositories/product.repo");
const api_error_util_1 = require("~/utils/api-error.util");
class CartService {
    static async addToCart({ user_id, product = {} }) {
        const userCart = await cart_model_1.CartModel.findOne({ user: user_id });
        if (!userCart) {
            return cart_repo_1.CartRepo.createUserCart({ user_id, product });
        }
        if (!userCart.products.length) {
            userCart.products = [product];
            return userCart.save();
        }
        return cart_repo_1.CartRepo.updateCartUserQuantity({ user_id, product });
    }
    /**
     *
     * @body
     * {
     *  shop_oder_ids: [
     *    {
     *     shop_id,
     *     item_products: [
     *         {
     *            quantity,
     *            old_quantity,
     *            price,
     *            shop_id,
     *            product_id,
     *         }
     *     ],
     *     version
     *    }
     *  ]
     * }
     */
    static async addToCartV2({ user_id, shop_order_ids = [] }) {
        for (const shop_order of shop_order_ids) {
            for (const item_product of shop_order.item_products) {
                const { product_id, quantity, old_quantity } = item_product;
                const foundProduct = await product_repo_1.ProductRepo.getProductById(product_id);
                if (!foundProduct) {
                    throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Product not found');
                }
                if (foundProduct.shop.toString() !== shop_order.shop_id) {
                    throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Product not belong to shop');
                }
                if (foundProduct.quantity < quantity) {
                    throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, `Product ${foundProduct.name} is out of stock`);
                }
                if (quantity === 0) {
                    await cart_repo_1.CartRepo.deleteProductFromCart({ user_id, product_ids: [product_id] });
                }
                else {
                    await cart_repo_1.CartRepo.updateCartUserQuantity({
                        user_id: user_id,
                        product: {
                            _id: product_id,
                            quantity: quantity - old_quantity
                        }
                    });
                }
            }
        }
        const userCart = await cart_repo_1.CartRepo.getListCarts(user_id);
        return userCart;
    }
    static async deleteProductFromCart({ user_id, product_ids }) {
        return cart_repo_1.CartRepo.deleteProductFromCart({ user_id, product_ids });
    }
    static async getListCarts(user_id) {
        return cart_repo_1.CartRepo.getListCarts(user_id);
    }
}
exports.CartService = CartService;
