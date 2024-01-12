"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const inventory_model_1 = require("~/models/inventory.model");
const product_repo_1 = require("~/models/repositories/product.repo");
const api_error_util_1 = require("~/utils/api-error.util");
class InventoryService {
    static async addStockToInventory({ stock, product_id, shop_id, location = 'HCM City' }) {
        const product = await product_repo_1.ProductRepo.findProductById({
            product_id,
            unSelect: ['_id', 'name', 'price', 'quantity', 'shop_id']
        });
        if (!product) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Product not found');
        }
        const query = { shop: shop_id, product: product_id };
        const update = {
            $inc: { quantity: stock },
            $set: { location }
        };
        const options = { upsert: true, new: true };
        return inventory_model_1.InventoryModel.findOneAndUpdate(query, update, options);
    }
}
exports.InventoryService = InventoryService;
