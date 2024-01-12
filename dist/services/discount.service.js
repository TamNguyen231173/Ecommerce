"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const discount_model_1 = require("~/models/discount.model");
const discount_repo_1 = require("~/models/repositories/discount.repo");
const product_repo_1 = require("~/models/repositories/product.repo");
const shop_model_1 = require("~/models/shop.model");
const api_error_util_1 = require("~/utils/api-error.util");
class DiscountService {
    static async createDiscountCode(shop_id, payload) {
        const { start_date, end_date } = payload;
        const today = new Date();
        const isStartDateValid = today < new Date(start_date);
        const isEndDateValid = today < new Date(end_date);
        const isDateRangeValid = new Date(start_date) < new Date(end_date);
        if (isStartDateValid || isEndDateValid) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Invalid date range');
        }
        if (!isDateRangeValid) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Invalid date range');
        }
        const foundDiscount = await discount_model_1.DiscountModel.findOne({ code: payload.code, shop: payload.shop }).lean();
        if (foundDiscount) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Discount code already exists');
        }
        return discount_model_1.DiscountModel.create({
            ...payload,
            shop: shop_id
        });
    }
    static async getAllProductsWithDiscountCode({ shop_id, discount_code, limit = 50, page = 1, sort = 'ctime' }) {
        const foundDiscount = await discount_repo_1.DiscountRepo.checkDiscountCodeExists({ code: discount_code, shop_id });
        const { applies_to, product_ids } = foundDiscount;
        const select = 'name description price images shop isPublished isDraft';
        let filter = { shop: shop_id, isPublished: true };
        if (applies_to === 'product') {
            filter = { ...filter, _id: { $in: product_ids } };
        }
        return product_repo_1.ProductRepo.findAllProducts({
            filter,
            limit,
            page,
            sort,
            select
        });
    }
    static async getAllDiscountsByShop({ shop_id, limit = 50, page = 1, sort = 'ctime' }) {
        const shop = await shop_model_1.ShopModel.findOne({ _id: new mongoose_1.Types.ObjectId(shop_id) }).lean();
        if (!shop) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Shop not found');
        }
        return discount_repo_1.DiscountRepo.getAllDiscounts({
            filter: { shop: shop_id },
            select: ['name', 'description', 'code', 'start_date', 'end_date', 'applies_to', 'product_ids'],
            limit,
            page,
            sort
        });
    }
    static async getDiscountAmount({ code, user_id, shop_id, products }) {
        const foundDiscount = await discount_repo_1.DiscountRepo.checkDiscountCodeExists({ code, shop_id });
        const { value, min_order_value, is_active, discount_limit, start_date, end_date, max_used_per_user, user_used, type } = foundDiscount;
        if (!is_active) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Discount code is inactive');
        }
        if (discount_limit === 0) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Discount code is out of stock');
        }
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Discount code is expired');
        }
        let totalOrder = 0;
        if (min_order_value && min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                if (product.quantity && product.price) {
                    return acc + product.quantity * product.price;
                }
                return acc;
            }, 0);
            if (totalOrder < min_order_value) {
                throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Discount code is not applicable');
            }
        }
        if (max_used_per_user && max_used_per_user > 0) {
            const userDiscountedCount = user_used.filter((user) => user === user_id).length;
            if (userDiscountedCount >= max_used_per_user) {
                throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Discount code is not applicable');
            }
        }
        const amount = type === 'percentage' ? (totalOrder * value) / 100 : value;
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        };
    }
    static async deleteDiscountCode({ shop_id, discount_id }) {
        const discountCode = await discount_model_1.DiscountModel.findOneAndDelete({ _id: discount_id, shop: shop_id });
        if (!discountCode) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Discount code not found');
        }
        return discountCode;
    }
    static async cancelDiscountCode({ shop_id, discount_id, user_id }) {
        const foundDiscount = discount_model_1.DiscountModel.findOne({ _id: discount_id, shop: shop_id }).lean();
        if (!foundDiscount) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Discount code not found');
        }
        return discount_model_1.DiscountModel.findOneAndUpdate({ _id: discount_id, shop: shop_id }, { $pull: { user_used: user_id } }, { new: true }).lean();
    }
}
exports.DiscountService = DiscountService;
