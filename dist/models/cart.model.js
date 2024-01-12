"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    state: { type: String, required: true },
    products: [{ type: mongoose_1.Schema.Types.Mixed, required: true }],
    count_products: { type: Number, default: 0 },
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
schema.pre('findOneAndUpdate', async function (next) {
    const cart = await this.model.findOne(this.getQuery());
    if (cart) {
        cart.count_products = cart.products.length;
        await cart.save();
    }
    next();
});
exports.CartModel = (0, mongoose_1.model)('Cart', schema);
