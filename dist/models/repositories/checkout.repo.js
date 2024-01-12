"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutRepo = void 0;
const filter_util_1 = require("~/utils/filter.util");
const order_model_1 = require("../order.model");
class CheckoutRepo {
    static async getOrdersByUser({ page, limit, sort, select, filter }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { updatedAt: -1 };
        return order_model_1.OrderModel.find(filter).select((0, filter_util_1.getSelectData)(select)).sort(sortBy).skip(skip).limit(limit).lean().exec();
    }
    static async getOrderByUser({ filter, unSelect }) {
        return order_model_1.OrderModel.findOne(filter).select((0, filter_util_1.getUnSelectData)(unSelect)).lean().exec();
    }
}
exports.CheckoutRepo = CheckoutRepo;
