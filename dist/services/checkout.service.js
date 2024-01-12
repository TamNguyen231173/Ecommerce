"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cart_repo_1 = require("~/models/repositories/cart.repo");
const product_repo_1 = require("~/models/repositories/product.repo");
const api_error_util_1 = require("~/utils/api-error.util");
const discount_service_1 = require("./discount.service");
const redis_service_1 = require("./redis.service");
const order_model_1 = require("~/models/order.model");
const checkout_repo_1 = require("~/models/repositories/checkout.repo");
class CheckoutService {
    /**
     *
     * @body
     * {
     *    cart_id: string,
     *    user_id: string,
     *    shop_order_ids: string[
     *        {
     *          shop_id: string,
     *          shop_discount: [],
     *          item_products: [{
     *            price,
     *            quantity,
     *            product_id,
     *          }]
     *        },
     *        {
     *          shop_id: string,
     *          shop_discount: [
     *              {
     *                shop_id,
     *                discount_id,
     *                code,
     *              }
     *          ],
     *          item_products: [{
     *            price,
     *            quantity,
     *            product_id,
     *          }]
     *        }
     *    ]
     * }
     */
    static async checkout({ cart_id, user_id, shop_order_ids }) {
        try {
            const foundCart = await cart_repo_1.CartRepo.findCartById(cart_id);
            const checkout_order = {
                total_price: 0,
                fee_ship: 0,
                total_discount: 0,
                total_checkout: 0
            };
            const shop_order_ids_new = [];
            // total bill
            for (let i = 0; i < shop_order_ids.length; i++) {
                const { shop_id, shop_discount = [], item_products = [] } = shop_order_ids[i];
                const checkProductServer = await product_repo_1.ProductRepo.checkProductByServer(item_products);
                if (!checkProductServer[0]) {
                    throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Product not found');
                }
                // total price
                const checkoutPrice = checkProductServer.reduce((acc, cur) => {
                    if (cur) {
                        return acc + cur.price * cur.quantity;
                    }
                    return acc;
                }, 0);
                // total before handle discount
                checkout_order.total_price += checkoutPrice;
                const itemCheckout = {
                    shop_id,
                    shop_discount,
                    price_raw: checkoutPrice,
                    price_apply_discount: checkoutPrice,
                    item_products: checkProductServer
                };
                if (shop_discount.length > 0) {
                    shop_discount.forEach(async (discounts) => {
                        const { discount = 0 } = await discount_service_1.DiscountService.getDiscountAmount({
                            code: discounts.code,
                            shop_id,
                            user_id,
                            products: checkProductServer
                        });
                        checkout_order.total_discount += discount;
                        if (discount > 0) {
                            itemCheckout.price_apply_discount = checkoutPrice - discount;
                        }
                    });
                }
                checkout_order.total_checkout += itemCheckout.price_apply_discount;
                shop_order_ids_new.push(itemCheckout);
            }
            return {
                shop_order_ids,
                shop_order_ids_new,
                checkout_order
            };
        }
        catch (error) {
            throw new api_error_util_1.ApiError(error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    static async orderByUser({ shop_order_ids_new, cart_id, user_id, user_address = {}, user_payment }) {
        try {
            const { checkout_order } = await CheckoutService.checkout({
                cart_id,
                user_id,
                shop_order_ids: shop_order_ids_new
            });
            // check if product is out of stock or not
            const products = shop_order_ids_new.flatMap((order) => order.item_products);
            const acquireProduct = [];
            for (let i = 0; i < products.length; i++) {
                const { product_id, quantity } = products[i];
                const keyLock = await redis_service_1.RedisService.acquireLock({
                    product_id,
                    quantity,
                    cart_id
                });
                acquireProduct.push(keyLock ? true : false);
                if (keyLock) {
                    await redis_service_1.RedisService.releaseLock(keyLock);
                }
            }
            // if product is out of stock
            if (acquireProduct.includes(false)) {
                throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Product is out of stock');
            }
            // create order
            return order_model_1.OrderModel.create({
                user: user_id,
                checkout: checkout_order,
                shipping: user_address,
                payment: user_payment,
                products: shop_order_ids_new
            });
        }
        catch (error) {
            throw new api_error_util_1.ApiError(error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    static async getOrdersByUser({ user_id, page, limit }) {
        try {
            const filter = { user: user_id };
            const select = ['checkout', 'shipping', 'payment', 'products'];
            return checkout_repo_1.CheckoutRepo.getOrdersByUser({ filter, page, limit, select });
        }
        catch (error) {
            throw new api_error_util_1.ApiError(error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    static async getOrderByUser({ order_id, user_id }) {
        try {
            const filter = { _id: order_id, user: user_id };
            return checkout_repo_1.CheckoutRepo.getOrderByUser({ filter, unSelect: ['__v'] });
        }
        catch (error) {
            throw new api_error_util_1.ApiError(error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
exports.CheckoutService = CheckoutService;
