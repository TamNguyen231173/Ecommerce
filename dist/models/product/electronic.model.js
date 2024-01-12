"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronicModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    manufacturer: { type: String, required: true },
    modelName: { type: String, required: true },
    color: { type: String, required: true }
}, { timestamps: true });
exports.ElectronicModel = (0, mongoose_1.model)('Electronic', schema);
