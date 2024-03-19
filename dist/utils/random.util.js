"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNum = exports.randomString = void 0;
const randomString = (length) => {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
};
exports.randomString = randomString;
const randomNum = (length) => {
    const result = [];
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return parseInt(result.join(''));
};
exports.randomNum = randomNum;
