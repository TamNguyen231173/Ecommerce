"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopRouter = void 0;
const express_1 = require("express");
require("express-async-errors");
exports.shopRouter = (0, express_1.Router)();
exports.shopRouter.get('/', (req, res) => {
    res.send('Welcome to EA SPORT SHOP!');
});
exports.default = exports.shopRouter;
