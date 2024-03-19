"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutRouter = void 0;
const express_1 = require("express");
const checkout_controller_1 = require("~/controllers/checkout.controller");
require("express-async-errors");
exports.checkoutRouter = (0, express_1.Router)();
exports.checkoutRouter.post('/:cart_id/review', checkout_controller_1.CheckoutController.checkoutReview);
exports.checkoutRouter.post('/:cart_id/order', checkout_controller_1.CheckoutController.checkoutOrder);
