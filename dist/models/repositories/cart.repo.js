"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepo = void 0;
const cart_model_1 = require("../cart.model");
const mongoose_1 = require("mongoose");
const api_error_util_1 = require("~/utils/api-error.util");
const http_status_1 = __importDefault(require("http-status"));
class CartRepo {
    static async createUserCart({ user_id, product = {} }) {
        const filter = { user: user_id, state: 'active' };
        const updateOrInsert = {
            $push: { products: product }
        };
        const options = { new: true, upsert: true };
        return cart_model_1.CartModel.findOneAndUpdate(filter, updateOrInsert, options);
    }
    static async updateCartUserQuantity({ user_id, product = {} }) {
        console.log('product', product);
        const filter = { user: user_id, state: 'active', 'products._id': product._id };
        const update = {
            $inc: { 'products.$.quantity': product.quantity }
        };
        const options = { new: true };
        return cart_model_1.CartModel.findOneAndUpdate(filter, update, options);
    }
    static async deleteProductFromCart({ user_id, product_ids }) {
        const filter = { user: user_id, state: 'active' };
        const update = {
            $pull: { products: { _id: { $in: product_ids } } },
            $inc: { count_products: -1 }
        };
        const options = { new: true };
        return cart_model_1.CartModel.findOneAndUpdate(filter, update, options);
    }
    static async getListCarts(user_id) {
        const filter = { user: user_id, state: 'active' };
        return cart_model_1.CartModel.findOne(filter).populate('products');
    }
    static async findCartById(cart_id) {
        const cart = await cart_model_1.CartModel.findOne({ _id: new mongoose_1.Types.ObjectId(cart_id), state: 'active' }).populate('products');
        if (!cart) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Cart not found');
        }
        return cart;
    }
}
exports.CartRepo = CartRepo;
