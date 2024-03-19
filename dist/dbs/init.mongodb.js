"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("~/configs");
class DbService {
    constructor() {
        this.connect();
    }
    connect(type = 'mongo') {
        // if (config.env === 'development') {
        //   mongoose.set('debug', true)
        //   mongoose.set('debug', { color: true })
        // }
        if (!mongoose_1.default.connections[0].readyState) {
            mongoose_1.default
                .connect(configs_1.mongooseConfig.uri)
                .then(() => {
                console.log('Connected to MongoDB');
                // checkOverload()
            })
                .catch((err) => console.log(err));
        }
    }
    static getInstance() {
        if (!DbService.instance) {
            DbService.instance = new DbService();
        }
        return DbService.instance;
    }
}
exports.DbService = DbService;
