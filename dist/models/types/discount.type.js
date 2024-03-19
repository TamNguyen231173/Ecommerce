"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountAppliesTo = exports.DiscountType = void 0;
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "percentage";
    DiscountType["FIXED"] = "fixed";
})(DiscountType = exports.DiscountType || (exports.DiscountType = {}));
var DiscountAppliesTo;
(function (DiscountAppliesTo) {
    DiscountAppliesTo["ALL"] = "all";
    DiscountAppliesTo["PRODUCT"] = "product";
    DiscountAppliesTo["COLLECTION"] = "collection";
    DiscountAppliesTo["CATEGORY"] = "category";
})(DiscountAppliesTo = exports.DiscountAppliesTo || (exports.DiscountAppliesTo = {}));
