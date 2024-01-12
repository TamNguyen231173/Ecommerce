"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const product_1 = require("~/models/product");
const product_repo_1 = require("~/models/repositories/product.repo");
const api_error_util_1 = require("~/utils/api-error.util");
const filter_util_1 = require("~/utils/filter.util");
const inventory_repo_1 = require("~/models/repositories/inventory.repo");
const notification_service_1 = require("./notification.service");
class ProductService {
    static registerProductType(type, productClass) {
        ProductService.productRegistry[type] = productClass;
    }
    static async createProduct(type, payload) {
        const productClass = ProductService.productRegistry[type];
        if (!productClass)
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Invalid product type');
        return new productClass(payload).createProduct();
    }
    static async updateProduct({ product_id, payload }) {
        const product = await product_repo_1.ProductRepo.findProductById({ product_id });
        if (!product)
            throw new api_error_util_1.ApiError(http_status_1.default.NOT_FOUND, 'Product not found');
        const productClass = ProductService.productRegistry[product.type];
        if (!productClass)
            throw new api_error_util_1.ApiError(http_status_1.default.BAD_REQUEST, 'Invalid product type');
        return new productClass(payload).updateProduct(product_id);
    }
    static async publishProductByShop({ shop_id, product_id }) {
        return product_repo_1.ProductRepo.publishProductByShop({ shop_id, product_id });
    }
    static async unPublishProductByShop({ shop_id, product_id }) {
        return product_repo_1.ProductRepo.unPublishProductByShop({ shop_id, product_id });
    }
    static async findAllDraftsForShop({ shop_id, limit = 50, skip = 0 }) {
        const query = { shop: shop_id, isDraft: true };
        return product_repo_1.ProductRepo.queryProducts({ query, limit, skip });
    }
    static async findAllPublishedProductsForShop({ shop_id, limit = 50, skip = 0 }) {
        const query = { shop: shop_id, isPublished: true };
        return product_repo_1.ProductRepo.queryProducts({ query, limit, skip });
    }
    static async searchProducts({ keySearch, limit = 50, skip = 0 }) {
        return product_repo_1.ProductRepo.searchProductByUser({ keySearch, limit, skip });
    }
    static async findAllProducts({ sort = 'ctime', limit = 50, page = 1, filter = { isPublished: true }, select = 'name price description thumb quantity type shop' }) {
        return product_repo_1.ProductRepo.findAllProducts({ limit, page, sort, filter, select });
    }
    static async findProductById(product_id) {
        return product_repo_1.ProductRepo.findProductById({
            product_id,
            unSelect: ['__v']
        });
    }
}
ProductService.productRegistry = {};
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
                shop: this.shop,
                stock: this.quantity,
                location: 'unknown'
            });
            // push notification to system
            notification_service_1.NotificationService.pushNotiToSystem({
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
    async updateProduct(product_id, payload) {
        const productAfterRemoveEmpty = (0, filter_util_1.removeEmpty)(payload);
        const productAfterUpdateNested = (0, filter_util_1.updateNestedObject)(productAfterRemoveEmpty);
        return product_repo_1.ProductRepo.updateProductById({
            product_id,
            payload: productAfterUpdateNested,
            model: product_1.ProductModel
        });
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
        console.log('this.attributes: ', this.attributes);
        const newCloth = await product_1.ClothModel.create({
            ...this.attributes,
            shop: this.shop
        });
        if (!newCloth)
            throw new Error('Cannot create new cloth');
        const newProduct = await super.createProduct(newCloth._id);
        if (!newProduct)
            throw new Error('Cannot create new product');
        return newProduct;
    }
    async updateProduct(product_id) {
        if (this.attributes) {
            await product_repo_1.ProductRepo.updateProductById({
                product_id,
                payload: this.attributes,
                model: product_1.ClothModel
            });
        }
        return super.updateProduct(product_id, this);
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
            throw new Error('Cannot create new electronic');
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct)
            throw new Error('Cannot create new product');
        return newProduct;
    }
    async updateProduct(product_id) {
        if (this.attributes) {
            await product_repo_1.ProductRepo.updateProductById({
                product_id,
                payload: this.attributes,
                model: product_1.ElectronicModel
            });
        }
        return super.updateProduct(product_id, this);
    }
}
// Define sub-class for different product types Furniture
class Furniture extends Product {
    constructor({ manufacturer, modelName, color, name, price, description, thumb, quantity, type, shop, attributes }) {
        super({ name, price, description, thumb, quantity, type, shop, attributes });
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.color = color;
    }
    async createProduct() {
        const newFur = await product_1.ElectronicModel.create({
            ...this.attributes,
            shop: this.shop
        });
        if (!newFur)
            throw new Error('Cannot create new furniture');
        const newProduct = await super.createProduct(newFur._id);
        if (!newProduct)
            throw new Error('Cannot create new product');
        return newProduct;
    }
    async updateProduct(product_id) {
        if (this.attributes) {
            await product_repo_1.ProductRepo.updateProductById({
                product_id,
                payload: this.attributes,
                model: product_1.ElectronicModel
            });
        }
        return super.updateProduct(product_id, this);
    }
}
// Register product types
ProductService.registerProductType(product_1.ProductType.CLOTH, Cloth);
ProductService.registerProductType(product_1.ProductType.ELECTRONIC, Electronic);
ProductService.registerProductType(product_1.ProductType.FURNITURE, Furniture);
