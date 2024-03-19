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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisPubSubService = void 0;
const Redis = __importStar(require("redis"));
const inventory_test_1 = require("~/tests/inventory.test");
const product_test_1 = require("~/tests/product.test");
class RedisPubSubService {
    static async runTest() {
        // Call the purchaseProduct method of ProductServiceTest to publish a 'product:purchase' event
        new inventory_test_1.InventoryServiceTest();
        // Create an instance of InventoryServiceTest to start listening to 'product:purchase' events
        await product_test_1.ProductServiceTest.purchaseProduct({ product_id: '1', quantity: 1 });
    }
    static async getInstance() {
        if (!RedisPubSubService.redisPublisher) {
            const publisher = Redis.createClient();
            await publisher.connect();
            RedisPubSubService.redisPublisher = publisher;
        }
        if (!RedisPubSubService.redisSubscriber) {
            const subscriber = Redis.createClient();
            await subscriber.connect();
            RedisPubSubService.redisSubscriber = subscriber;
        }
        console.log('Redis PubSub Service is ready');
        return { publisher: RedisPubSubService.redisPublisher, subscriber: RedisPubSubService.redisSubscriber };
    }
    static async publish(channel, message) {
        return RedisPubSubService.redisPublisher.publish(channel, message);
    }
    static subscribe(channel, callback) {
        return RedisPubSubService.redisSubscriber.subscribe(channel, (message, channel) => {
            callback(channel, message);
        });
    }
}
exports.RedisPubSubService = RedisPubSubService;
