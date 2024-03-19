"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebService = void 0;
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const configs_1 = require("~/configs");
const error_middleware_1 = require("~/middlewares/error.middleware");
const routes_1 = __importDefault(require("~/routes"));
require("~/tests/inventory.test");
class WebService {
    static async start() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, morgan_1.default)(configs_1.config.env === 'development' ? 'dev' : 'combined'));
        this.app.use((0, compression_1.default)());
        this.app.use(routes_1.default);
        this.app.use(error_middleware_1.errorHandler);
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
WebService.port = configs_1.config.port || 3000;
exports.WebService = WebService;
