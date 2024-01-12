"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    location: { type: String, required: true },
    stock: { type: Number, required: true },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', required: true },
    reservations: { type: Array, default: [] }
}, { timestamps: true });
exports.InventoryModel = (0, mongoose_1.model)('Inventory', schema);
