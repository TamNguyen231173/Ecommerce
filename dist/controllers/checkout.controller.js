"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const checkout_service_1 = require("~/services/checkout.service");
class CheckoutController {
    static async checkoutReview(req, res) {
        const data = await checkout_service_1.CheckoutService.checkout({
            cart_id: req.params.cart_id,
            user_id: req.user._id,
            shop_order_ids: req.body.shop_order_ids
        });
        res.status(200).json({
            message: 'Checkout successfully',
            data
        });
    }
    static async checkoutOrder(req, res) {
        const data = await checkout_service_1.CheckoutService.orderByUser({
            cart_id: req.params.cart_id,
            user_id: req.user._id,
            shop_order_ids_new: req.body.shop_order_ids,
            user_payment: req.body.user_payment,
            user_address: req.body.user_address
        });
        res.status(200).json({
            message: 'Checkout successfully',
            data
        });
    }
}
exports.CheckoutController = CheckoutController;
