"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const configs_1 = require("~/configs");
const enumerateErrorFormat = winston_1.default.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
exports.logger = winston_1.default.createLogger({
    level: configs_1.config.env === 'development' ? 'debug' : 'info',
    format: winston_1.default.format.combine(enumerateErrorFormat(), configs_1.config.env === 'development' ? winston_1.default.format.colorize() : winston_1.default.format.uncolorize(), winston_1.default.format.splat(), winston_1.default.format.printf(({ level, message }) => `${level}: ${message}`)),
    transports: [
        new winston_1.default.transports.Console({
            stderrLevels: ['error']
        })
    ]
});
