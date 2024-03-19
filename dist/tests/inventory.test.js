"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryServiceTest = void 0;
const redisPubSub_service_1 = require("~/services/redisPubSub.service");
class InventoryServiceTest {
    constructor() {
        redisPubSub_service_1.RedisPubSubService.subscribe('product:purchase', (channel, message) => {
            const { product_id, quantity } = JSON.parse(message);
            InventoryServiceTest.updateInventory({ product_id, quantity });
        });
    }
    static updateInventory({ product_id, quantity }) {
        console.log(`Updating inventory for product ${product_id} by ${quantity}`);
    }
}
exports.InventoryServiceTest = InventoryServiceTest;
