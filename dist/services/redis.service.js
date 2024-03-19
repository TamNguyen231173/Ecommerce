"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis = __importStar(require("redis"));
const util_1 = require("util");
const inventory_repo_1 = require("~/models/repositories/inventory.repo");
class RedisService {
    static async acquireLock({ product_id, quantity, cart_id }) {
        const key = `lock_v_:${product_id}`;
        const retryTimes = 10;
        const expire = 3000;
        for (let i = 0; i < retryTimes; i++) {
            const result = await this.setnxAsync(key, expire);
            if (result === 1) {
                // handle inventory
                const isReservation = await inventory_repo_1.InventoryRepo.reserveInventory({
                    product_id,
                    quantity,
                    cart_id
                });
                if (isReservation?.isModified) {
                    await this.pexpire(key, expire);
                    return key;
                }
                return null;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    static async releaseLock(key) {
        const delAsyncKey = (0, util_1.promisify)(this.redisClient.del).bind(this.redisClient);
        return delAsyncKey(key);
    }
}
_a = RedisService;
RedisService.redisClient = redis.createClient();
RedisService.pexpire = (0, util_1.promisify)(RedisService.redisClient.pExpire).bind(_a.redisClient);
RedisService.setnxAsync = (0, util_1.promisify)(RedisService.redisClient.setNX).bind(_a.redisClient);
exports.RedisService = RedisService;
