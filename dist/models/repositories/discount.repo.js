"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRepo = void 0;
const filter_util_1 = require("~/utils/filter.util");
const discount_model_1 = require("../discount.model");
const mongoose_1 = require("mongoose");
const http_status_1 = __importDefault(require("http-status"));
const api_error_util_1 = require("~/utils/api-error.util");
class DiscountRepo {
    static async getAllDiscounts({ limit = 50, page = 1, sort = 'ctime', filter = {}, select }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
        return discount_model_1.DiscountModel.find(filter)
            .sort(sortBy)
            .select((0, filter_util_1.getSelectData)(select))
            .skip(skip)
            .limit(limit)
            .populate({
            path: 'product_ids',
            select: 'name'
        })
            .lean();
    }
    static async checkDiscountCodeExists({ code, shop_id }) {
        const foundDiscount = await discount_model_1.DiscountModel.findOne({ code, shop: new mongoose_1.Types.ObjectId(shop_id) }).lean();
        if (!foundDiscount) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Discount code not found');
        }
        return foundDiscount;
    }
}
exports.DiscountRepo = DiscountRepo;
