"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const configs_1 = require("~/configs");
const logger_config_1 = require("~/configs/logger.config");
const api_error_util_1 = require("~/utils/api-error.util");
const errorHandler = (err, req, res, next) => {
    let error = err;
    if (error && !(error instanceof api_error_util_1.ApiError)) {
        const statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_1.default[statusCode];
        error = new api_error_util_1.ApiError(statusCode, message, false, err.stack);
    }
    const { statusCode, message } = error;
    res.errorMessage = error.message;
    const response = {
        code: statusCode,
        message
    };
    if (configs_1.config.env === 'development') {
        logger_config_1.logger.error(err.message + req.url);
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
