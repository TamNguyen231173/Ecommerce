"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRouter = void 0;
const express_1 = require("express");
const inventory_controller_1 = require("~/controllers/inventory.controller");
exports.inventoryRouter = (0, express_1.Router)();
exports.inventoryRouter.post('/shop/:shop_id/:product_id/add-stock', inventory_controller_1.InventoryController.addStock);
