"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const http_status_1 = __importDefault(require("http-status"));
const keyToken_service_1 = require("~/services/keyToken.service");
const api_error_util_1 = require("~/utils/api-error.util");
const apiKey_middleware_1 = require("./apiKey.middleware");
const auth_util_1 = require("~/utils/auth.util");
const shop_service_1 = require("~/services/shop.service");
const verifyToken = async (token, publicKey, userId, options) => {
    try {
        const decodedUser = (await (0, auth_util_1.verifyJwt)({
            token,
            publicKey
        }));
        if (!decodedUser && options === 'refreshToken') {
            await keyToken_service_1.KeyTokenService.removeKeyByUserId(userId);
            throw new api_error_util_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid token');
        }
        if (userId !== decodedUser?._id)
            throw new api_error_util_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid token');
        const shop = await shop_service_1.ShopService.findByEmail(decodedUser.email);
        if (!shop)
            throw new api_error_util_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid token');
        return shop;
    }
    catch (error) {
        throw new api_error_util_1.ApiError(error.statusCode, error.message);
    }
};
const authentication = async (req, res, next) => {
    const userId = req.headers[apiKey_middleware_1.HEADER.CLIENT_ID]?.toString();
    if (!userId)
        throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Missing client id');
    const keyStore = await keyToken_service_1.KeyTokenService.findByUserId(userId);
    if (!keyStore)
        throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Client id not found');
    if (!keyStore.publicKey)
        throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Missing public key');
    const refreshToken = req.headers[apiKey_middleware_1.HEADER.REFRESH_TOKEN]?.toString().replace('Bearer ', '');
    const accessToken = req.headers[apiKey_middleware_1.HEADER.AUTHORIZATION]?.toString().replace('Bearer ', '');
    try {
        if (refreshToken) {
            const decodedUser = await verifyToken(refreshToken, keyStore.publicKey, userId, 'refreshToken');
            req.keyStore = keyStore;
            req.user = decodedUser;
            req.refreshToken = refreshToken;
        }
        else if (accessToken) {
            const decodedUser = await verifyToken(accessToken, keyStore.publicKey, userId);
            req.keyStore = keyStore;
            req.user = decodedUser;
        }
        else {
            throw new api_error_util_1.ApiError(http_status_1.default.FORBIDDEN, 'Missing access token');
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.authentication = authentication;
