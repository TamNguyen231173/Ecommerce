"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const shop_model_1 = require("~/models/shop.model");
const api_error_util_1 = require("~/utils/api-error.util");
const auth_util_1 = require("~/utils/auth.util");
const filter_util_1 = require("~/utils/filter.util");
const keyToken_service_1 = require("./keyToken.service");
const shop_service_1 = require("./shop.service");
class AuthService {
    static async generateTokens(payload) {
        const { privateKey, publicKey } = await crypto_1.default.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        const tokenPair = await (0, auth_util_1.createTokenPair)({
            payload,
            privateKey
        });
        if (!tokenPair) {
            throw new api_error_util_1.ApiError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Cannot create token pair');
        }
        const publicKeyString = await keyToken_service_1.KeyTokenService.createKeyToken({
            user: payload,
            publicKey,
            refreshToken: tokenPair.refreshToken
        });
        if (!publicKeyString) {
            throw new api_error_util_1.ApiError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Cannot create public key');
        }
        return tokenPair;
    }
    static async login(payload) {
        const foundShop = await shop_service_1.ShopService.findByEmail(payload.email);
        if (!foundShop) {
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Email not found');
        }
        const isMatch = await bcrypt_1.default.compare(payload.password, foundShop.password);
        if (!isMatch) {
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Password is incorrect');
        }
        const infoData = (0, filter_util_1.getInfoData)({
            filed: ['_id', 'email', 'name', 'role', 'status', 'verify'],
            object: foundShop
        });
        const { accessToken, refreshToken } = await this.generateTokens(infoData);
        return {
            shop: infoData,
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
    static async register(payload) {
        try {
            const holderShop = await shop_model_1.ShopModel.findOne({ email: payload.email }).lean();
            if (holderShop) {
                throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Email already exists');
            }
            const hashPassword = await bcrypt_1.default.hash(payload.password, 10);
            const newShop = await shop_model_1.ShopModel.create({
                ...payload,
                role: [shop_model_1.ShopRole.SHOP],
                password: hashPassword,
                verify: false,
                status: shop_model_1.ShopStatus.OPEN
            });
            if (newShop) {
                const infoData = (0, filter_util_1.getInfoData)({
                    filed: ['_id', 'email', 'name', 'role', 'status', 'verify'],
                    object: newShop
                });
                const { accessToken, refreshToken } = await this.generateTokens(infoData);
                return {
                    shop: infoData,
                    tokens: {
                        accessToken,
                        refreshToken
                    }
                };
            }
            return null;
        }
        catch (error) {
            throw new api_error_util_1.ApiError(error.statusCode, error.message);
        }
    }
    static async logout(keyStore) {
        try {
            return keyToken_service_1.KeyTokenService.removeKeyById(keyStore._id);
        }
        catch (error) {
            throw new api_error_util_1.ApiError(error.statusCode, error.message);
        }
    }
    static async refreshToken({ refreshToken, keyStore, user }) {
        if (keyStore.refreshTokenUsed?.includes(refreshToken)) {
            await keyToken_service_1.KeyTokenService.removeKeyByUserId(user._id);
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Refresh token is used');
        }
        if (keyStore.refreshToken !== refreshToken)
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Refresh token is not exists');
        console.log(user.email);
        const shop = await shop_service_1.ShopService.findByEmail(user.email);
        if (!shop)
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Email not found');
        const tokens = await this.generateTokens(shop);
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        });
        return {
            shop: (0, filter_util_1.getInfoData)({
                filed: ['_id', 'email', 'name', 'role', 'status', 'verify'],
                object: shop
            }),
            tokens
        };
    }
}
exports.AuthService = AuthService;
