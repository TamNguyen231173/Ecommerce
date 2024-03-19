"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServiceTest = void 0;
const redisPubSub_service_1 = require("~/services/redisPubSub.service");
class ProductServiceTest {
    static async purchaseProduct({ product_id, quantity }) {
        const order = { product_id, quantity };
        redisPubSub_service_1.RedisPubSubService.publish('product:purchase', JSON.stringify(order));
    }
}
exports.ProductServiceTest = ProductServiceTest;
