"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNestedObject = exports.removeEmpty = exports.getUnSelectData = exports.getSelectData = exports.getInfoData = void 0;
const pick_1 = __importDefault(require("lodash/pick"));
const getInfoData = ({ filed = [], object = {} }) => {
    return (0, pick_1.default)(object, filed);
};
exports.getInfoData = getInfoData;
const getSelectData = (filed = []) => {
    return Object.fromEntries(filed.map((item) => [item, 1]));
};
exports.getSelectData = getSelectData;
const getUnSelectData = (filed = []) => {
    return Object.fromEntries(filed.map((item) => [item, 0]));
};
exports.getUnSelectData = getUnSelectData;
const removeEmpty = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object')
            (0, exports.removeEmpty)(obj[key]);
        else if (obj[key] === undefined || obj[key] === null)
            delete obj[key];
    });
    return obj;
};
exports.removeEmpty = removeEmpty;
const updateNestedObject = (obj) => {
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const nestedObj = (0, exports.updateNestedObject)(obj[key]);
            Object.keys(nestedObj).forEach((nestedKey) => {
                final[`${key}.${nestedKey}`] = nestedObj[nestedKey];
            });
        }
        else {
            final[key] = obj[key];
        }
    });
    return final;
};
exports.updateNestedObject = updateNestedObject;
