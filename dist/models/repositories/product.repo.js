"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepo = void 0;
const product_1 = require("../product");
const filter_util_1 = require("~/utils/filter.util");
class ProductRepo {
    static publishProductByShop({ shop_id, product_id }) {
        const foundShop = product_1.ProductModel.findOne({ _id: product_id, shop: shop_id });
        if (!foundShop) {
            throw new Error('Product not found');
        }
        return product_1.ProductModel.updateOne({ _id: product_id }, { isDraft: false, isPublished: true }, { new: true }).exec();
    }
    static unPublishProductByShop({ shop_id, product_id }) {
        const foundShop = product_1.ProductModel.findOne({ _id: product_id, shop: shop_id });
        if (!foundShop) {
            throw new Error('Product not found');
        }
        return product_1.ProductModel.updateOne({ _id: product_id }, { isDraft: true, isPublished: false }, { new: true }).exec();
    }
    static async queryProducts({ query, limit, skip }) {
        return product_1.ProductModel.find(query)
            .populate('shop', 'name email -_id')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    }
    static async searchProductByUser({ keySearch, limit, skip }) {
        const regexSearch = new RegExp(keySearch, 'i');
        return product_1.ProductModel.find({
            $or: [{ name: { $regex: regexSearch } }, { description: { $regex: regexSearch } }],
            isDraft: false
        }, null, { limit, skip })
            .sort({ updatedAt: -1 })
            .lean();
    }
    static async findAllProducts({ sort = 'ctime', limit, page, filter, select }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { createdAt: -1 } : { updatedAt: -1 };
        return product_1.ProductModel.find(filter, select).sort(sortBy).skip(skip).limit(limit).lean().exec();
    }
    static async findProductById({ product_id, unSelect }) {
        return product_1.ProductModel.findById(product_id).select((0, filter_util_1.getUnSelectData)(unSelect)).lean().exec();
    }
    static async updateProductById({ product_id, payload, model, isNew = true }) {
        return model.findOneAndUpdate({ _id: product_id }, payload, { new: isNew }).lean().exec();
    }
    static async getProductById(product_id) {
        return product_1.ProductModel.findById(product_id).lean().exec();
    }
    static async checkProductByServer(products) {
        const productsWithDetails = await Promise.all(products.map(async (product) => {
            const foundProduct = await product_1.ProductModel.findById(product.product_id).lean().exec();
            if (foundProduct) {
                return {
                    price: foundProduct.price,
                    quantity: product.quantity,
                    product_id: product.product_id
                };
            }
        }));
        // Filter out undefined values
        return productsWithDetails.filter((product) => product !== undefined);
    }
}
exports.ProductRepo = ProductRepo;
