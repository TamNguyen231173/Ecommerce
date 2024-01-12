"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = __importDefault(require("./api"));
const mainRouter = (0, express_1.Router)();
mainRouter.get('/', (req, res) => {
    res.send('Welcome to EA SPORT!');
});
// mainRouter.post('/create-api-key', async (req, res) => {
//   const apiKey = await ApiKeyService.createKey()
//   res.send(apiKey)
// })
// mainRouter.use(apiKey)
// mainRouter.use(permission('0000'))
mainRouter.use('/api/v1', api_1.default);
exports.default = mainRouter;
