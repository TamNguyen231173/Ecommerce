"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModel = exports.API_KEY_PERMISSION = void 0;
const mongoose_1 = require("mongoose");
var API_KEY_PERMISSION;
(function (API_KEY_PERMISSION) {
    API_KEY_PERMISSION["USER"] = "user";
    API_KEY_PERMISSION["ADMIN"] = "admin";
})(API_KEY_PERMISSION = exports.API_KEY_PERMISSION || (exports.API_KEY_PERMISSION = {}));
const schema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    permissions: { type: [String], default: [] }
}, { timestamps: true });
exports.ApiKeyModel = (0, mongoose_1.model)('ApiKey', schema);
