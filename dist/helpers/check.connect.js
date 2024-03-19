"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOverload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const _SECOND = 60 * 1000;
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose_1.default.connections.length;
        const numCores = os_1.default.cpus().length;
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log('----------------------------------------');
        console.log('Number of connections: ', numConnection);
        console.log('Number of cores: ', numCores);
        console.log('Memory usage: ', memoryUsage, ' MB');
        console.log('----------------------------------------');
        if (numConnection > numCores * 7) {
            console.log('Overload!');
            // notify to admin
        }
    }, _SECOND); // Monitor every 5 seconds
};
exports.checkOverload = checkOverload;
