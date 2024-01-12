"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = exports.apiKey = exports.HEADER = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_util_1 = require("~/utils/api-error.util");
const apiKey_service_1 = require("~/services/apiKey.service");
exports.HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token'
};
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[exports.HEADER.API_KEY]?.toString();
        if (!key) {
            throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Missing API key');
        }
        const objKey = await apiKey_service_1.ApiKeyService.findById(key);
        if (!objKey) {
            throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Invalid API key');
        }
        req.objKey = objKey;
        return next();
    }
    catch (error) {
        throw new api_error_util_1.ApiError(error.statusCode, error.message);
    }
};
exports.apiKey = apiKey;
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions.includes(permission)) {
            throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Permission denied');
        }
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Permission denied');
        }
        return next();
    };
};
exports.permission = permission;
