"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("~/services/inventory.service");
class InventoryController {
    static async addStock(req, res) {
        const data = await inventory_service_1.InventoryService.addStockToInventory({
            product_id: req.params.product_id,
            stock: req.body.stock,
            shop_id: req.params.shop_id,
            location: req.body.location
        });
        res.status(200).json({
            message: 'Add stock successfully',
            data
        });
    }
}
exports.InventoryController = InventoryController;
