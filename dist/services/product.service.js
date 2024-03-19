"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_1 = require("~/models/product");
const api_error_util_1 = require("~/utils/api-error.util");
const http_status_1 = __importDefault(require("http-status"));
const inventory_repo_1 = require("~/models/repositories/inventory.repo");
const notification_service_1 = require("./notification.service");
class ProductService {
    static async createProduct(type, payload) {
        switch (type) {
            case product_1.ProductType.CLOTH:
                return new Cloth(payload).createProduct();
            case product_1.ProductType.ELECTRONIC:
                return new Electronic(payload).createProduct();
            default:
                throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, `Invalid product type ${type}`);
        }
    }
}
exports.ProductService = ProductService;
// Define base product class
class Product {
    constructor({ name, price, description, thumb, quantity, type, shop, attributes }) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.thumb = thumb;
        this.quantity = quantity;
        this.type = type;
        this.shop = shop;
        this.attributes = attributes;
    }
    async createProduct(product_id) {
        const newProduct = await product_1.ProductModel.create({
            ...this,
            _id: product_id
        });
        if (newProduct) {
            await inventory_repo_1.InventoryRepo.insertInventory({
                product: product_id,
                shop: this.shop._id,
                stock: this.quantity
            });
            // push notification to system
            await notification_service_1.NotificationService.pushNotiToSystem({
                type: 'SHOP_001',
                receiver: 'this is a lot user',
                sender: this.shop._id,
                options: {
                    product_name: this.name,
                    shop_name: this.shop.name
                }
            });
        }
        return newProduct;
    }
}
// Define sub-class for different product types Cloth
class Cloth extends Product {
    constructor({ brand, size, material, name, price, description, thumb, quantity, type, shop, attributes }) {
        super({ name, price, description, thumb, quantity, type, shop, attributes });
        this.brand = brand;
        this.size = size;
        this.material = material;
    }
    async createProduct() {
        const newCloth = await product_1.ClothModel.create({
            ...this.attributes,
            shop: this.shop
        });
        if (!newCloth)
            throw new Error('Cannot create new cloth');
        const newProduct = super.createProduct(newCloth._id);
        if (!newProduct)
            throw new Error('Cannot create new product');
        return newProduct;
    }
}
// Define sub-class for different product types Electronic
class Electronic extends Product {
    constructor({ manufacturer, modelName, color, name, price, description, thumb, quantity, type, shop, attributes }) {
        super({ name, price, description, thumb, quantity, type, shop, attributes });
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.color = color;
    }
    async createProduct() {
        const newElectronic = await product_1.ElectronicModel.create({
            ...this.attributes,
            shop: this.shop
        });
        if (!newElectronic)
            throw new Error('Cannot create new cloth');
        const newProduct = super.createProduct(newElectronic._id);
        if (!newProduct)
            throw new Error('Cannot create new product');
        return newProduct;
    }
}
