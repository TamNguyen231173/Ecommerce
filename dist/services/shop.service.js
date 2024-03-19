"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const shop_model_1 = require("~/models/shop.model");
class ShopService {
    static async findByEmail(email, options = {
        select: {
            email: 1,
            password: 2,
            name: 1,
            status: 1,
            roles: 1
        }
    }) {
        return shop_model_1.ShopModel.findOne({ email }).select(options.select).lean();
    }
}
exports.ShopService = ShopService;
