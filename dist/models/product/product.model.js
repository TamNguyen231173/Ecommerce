"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = exports.ProductType = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
var ProductType;
(function (ProductType) {
    ProductType["BOOK"] = "book";
    ProductType["ELECTRONIC"] = "electronic";
    ProductType["CLOTH"] = "cloth";
    ProductType["OTHER"] = "other";
    ProductType["FURNITURE"] = "furniture";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    thumb: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true, enum: Object.values(ProductType) },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', required: true },
    attributes: { type: mongoose_1.Schema.Types.Mixed, required: true },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, { timestamps: true });
schema.index({ name: 'text', description: 'text' });
schema.pre('save', function (next) {
    console.log('this.name: ', this.name);
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
exports.ProductModel = (0, mongoose_1.model)('Product', schema);
