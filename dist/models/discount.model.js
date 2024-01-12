"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    value: { type: Number, required: true },
    code: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    discount_limit: { type: Number, required: true },
    discount_used: { type: Number, default: 0 },
    user_used: [{ type: mongoose_1.Types.ObjectId, ref: 'User', default: [] }],
    max_used_per_user: { type: Number, required: true },
    min_order_value: { type: Number, required: true },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', required: true },
    is_active: { type: Boolean, default: true },
    applies_to: {
        type: String,
        enum: ['all', 'product', 'collection', 'category'],
        default: 'all'
    },
    product_ids: [{ type: mongoose_1.Types.ObjectId, ref: 'Product', default: [] }]
}, { timestamps: true });
exports.DiscountModel = (0, mongoose_1.model)('Discount', schema);
