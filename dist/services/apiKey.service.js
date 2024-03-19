"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const apikey_model_1 = require("~/models/apikey.model");
class ApiKeyService {
    static async createKey() {
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return apikey_model_1.ApiKeyModel.create({
            key,
            status: true
        });
    }
    static async findById(key) {
        return apikey_model_1.ApiKeyModel.findOne({ key, status: true }).lean();
    }
}
exports.ApiKeyService = ApiKeyService;
