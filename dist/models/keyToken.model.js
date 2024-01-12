"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyTokenModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: { type: String, required: true },
    refreshTokenUsed: { type: Array, default: [] },
    refreshToken: { type: String, required: true }
}, { timestamps: true });
exports.KeyTokenModel = (0, mongoose_1.model)('KeyToken', schema);
