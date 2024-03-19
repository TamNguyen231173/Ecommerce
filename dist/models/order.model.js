"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const random_util_1 = require("~/utils/random.util");
const schema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    checkout: {
        type: Object,
        default: {}
    },
    shipping: {
        type: Object,
        default: {}
    },
    payment: {
        type: Object,
        default: {}
    },
    products: {
        type: Array,
        required: true
    },
    tracking: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCEL', 'DELIVERED', 'COMPLETED'],
        default: 'PENDING'
    }
}, { timestamps: true });
schema.pre('save', function (next) {
    const order = this;
    order.tracking = (0, random_util_1.randomString)(10);
    next();
});
exports.OrderModel = (0, mongoose_1.model)('Order', schema);
