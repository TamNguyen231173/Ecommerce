"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FurnitureModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    material: { type: String, required: true },
    color: { type: String, required: true },
    weight: { type: Number, required: true }
}, { timestamps: true });
exports.FurnitureModel = (0, mongoose_1.model)('Furniture', schema);
