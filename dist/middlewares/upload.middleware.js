"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const formidable_1 = __importDefault(require("formidable"));
const http_status_1 = __importDefault(require("http-status"));
const api_error_util_1 = require("~/utils/api-error.util");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const fileOptions = (extFilter = [], limitedSize = 2 * 1024 * 1024, destination) => {
    return {
        uploadDir: destination,
        // multiples: true,
        maxFieldsSize: limitedSize,
        filename: function (name, ext, part, form) {
            return (0, uuid_1.v4)() + '_' + new Date().getTime().toString() + '_' + part['originalFilename'];
        },
        filter: function ({ originalFilename }) {
            if (!originalFilename)
                return false;
            const ext = originalFilename.split('.').pop();
            console.log(ext);
            if (extFilter.length > 0 && !extFilter.includes(ext))
                throw new Error('Unsupported file type');
            return true;
        },
        multiples: true
    };
};
const uploadMiddleware = (extFilter = [], limitedSize = 2 * 1000 * 1000, destination) => (req, res, next) => {
    if (destination && !fs_1.default.existsSync(destination)) {
        fs_1.default.mkdirSync(destination);
    }
    const form = (0, formidable_1.default)(fileOptions(extFilter, limitedSize, destination));
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log('File error', err);
            return next(new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Failed to upload file'));
        }
        req.body = fields;
        if (Object.keys(files).length <= 0) {
            req.files = {};
            return next();
        }
        if (files.file && !Array.isArray(files.file)) {
            files.file = [files.file];
        }
        const filesForFilter = [];
        for (const field in files) {
            if (Array.isArray(files[field]))
                filesForFilter.concat(files[field]);
            else
                filesForFilter.push(files[field]);
        }
        req.files = files;
        next();
    });
};
exports.uploadMiddleware = uploadMiddleware;
