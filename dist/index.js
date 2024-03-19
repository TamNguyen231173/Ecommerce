"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_mongodb_1 = require("./dbs/init.mongodb");
const redisPubSub_service_1 = require("./services/redisPubSub.service");
const web_service_1 = require("./services/web.service");
const main = async () => {
    try {
        await web_service_1.WebService.start();
        await init_mongodb_1.DbService.getInstance();
        await redisPubSub_service_1.RedisPubSubService.getInstance();
        // await RedisPubSubService.runTest()
    }
    catch (error) {
        console.log(error);
    }
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => { });
