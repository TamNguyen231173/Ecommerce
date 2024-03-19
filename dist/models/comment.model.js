"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: { type: String, required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    content: { type: String, required: true },
    left: { type: Number, default: null },
    right: { type: Number, default: null },
    parent_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' },
    isDeleted: { type: Boolean, default: false, select: false }
}, { timestamps: true });
exports.CommentModel = (0, mongoose_1.model)('Comment', schema);
