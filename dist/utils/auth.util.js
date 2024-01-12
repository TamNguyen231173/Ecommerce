"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.createTokenPair = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_util_1 = require("./api-error.util");
const http_status_1 = __importDefault(require("http-status"));
const createTokenPair = async ({ payload, privateKey }) => {
    try {
        const accessToken = await jsonwebtoken_1.default.sign(payload, privateKey, {
            expiresIn: '1 day',
            algorithm: 'RS256'
        });
        const refreshToken = await jsonwebtoken_1.default.sign(payload, privateKey, {
            expiresIn: '7 days',
            algorithm: 'RS256'
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
    }
};
exports.createTokenPair = createTokenPair;
const verifyJwt = async ({ token, publicKey }) => {
    try {
        const decoded = (await jsonwebtoken_1.default.verify(token, publicKey, {
            algorithms: ['RS256']
        }));
        return decoded;
    }
    catch (error) {
        throw new api_error_util_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Verify token failed');
    }
};
exports.verifyJwt = verifyJwt;
