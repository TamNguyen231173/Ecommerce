"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRepo = void 0;
const inventory_model_1 = require("../inventory.model");
class InventoryRepo {
    static async insertInventory(payload) {
        return await inventory_model_1.InventoryModel.create(payload);
    }
    static async reserveInventory({ product_id, quantity, cart_id }) {
        const query = {
            product: product_id,
            stock: { $gte: quantity }
        };
        const updateSet = {
            $inc: { stock: -quantity },
            push: {
                reservations: {
                    cart_id,
                    quantity,
                    create_on: new Date()
                }
            }
        };
        const options = { new: true, upsert: true };
        return inventory_model_1.InventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}
exports.InventoryRepo = InventoryRepo;
