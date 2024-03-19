"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClothModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true }
}, { timestamps: true });
exports.ClothModel = (0, mongoose_1.model)('Cloth', schema);
