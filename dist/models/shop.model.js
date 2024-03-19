"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModel = exports.ShopStatus = exports.ShopRole = void 0;
const mongoose_1 = require("mongoose");
var ShopRole;
(function (ShopRole) {
    ShopRole["SHOP"] = "shop";
    ShopRole["WRITER"] = "writer";
    ShopRole["EDITOR"] = "editor";
    ShopRole["ADMIN"] = "admin";
})(ShopRole = exports.ShopRole || (exports.ShopRole = {}));
var ShopStatus;
(function (ShopStatus) {
    ShopStatus["OPEN"] = "open";
    ShopStatus["CLOSE"] = "close";
})(ShopStatus = exports.ShopStatus || (exports.ShopStatus = {}));
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    verify: { type: Boolean, required: true },
    roles: { type: Array, default: [] }
}, { timestamps: true });
exports.ShopModel = (0, mongoose_1.model)('Shop', schema);
