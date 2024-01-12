"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.mongooseConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.mongooseConfig = {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/express-typescript'
};
exports.config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    }
};
