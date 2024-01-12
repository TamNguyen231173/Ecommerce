"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("~/controllers/product.controller");
const auth_middleware_1 = require("~/middlewares/auth.middleware");
exports.productRouter = (0, express_1.Router)();
// Customer
exports.productRouter.get('/search', product_controller_1.ProductController.searchProducts);
exports.productRouter.get('/all', product_controller_1.ProductController.getAllProducts);
exports.productRouter.get('/:id', product_controller_1.ProductController.getProductById);
// Shop
exports.productRouter.use(auth_middleware_1.authentication);
exports.productRouter.post('/create', product_controller_1.ProductController.create);
exports.productRouter.patch('/update/:id', product_controller_1.ProductController.updateProductById);
exports.productRouter.get('/draft/all', product_controller_1.ProductController.getAllDraftsForShop);
exports.productRouter.get('/published/all', product_controller_1.ProductController.getAllPublishedForShop);
exports.productRouter.patch('/publish/:id', product_controller_1.ProductController.publishProductByShop);
exports.productRouter.patch('/unpublish/:id', product_controller_1.ProductController.unPublishProductByShop);
