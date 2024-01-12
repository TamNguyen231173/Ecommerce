"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyTokenService = void 0;
const keyToken_model_1 = require("~/models/keyToken.model");
class KeyTokenService {
    static async createKeyToken({ user, publicKey, refreshToken }) {
        try {
            // const tokens = await TokenModel.create({
            //   user: user._id,
            //   publicKey: publicKey.toString()
            // })
            // return tokens ? tokens.publicKey : null
            const filter = { user };
            const update = { publicKey: publicKey.toString(), refreshToken };
            const options = { new: true, upsert: true };
            const tokens = await keyToken_model_1.KeyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        }
        catch (error) {
            console.log(error);
        }
    }
    static async findByUserId(userId) {
        return keyToken_model_1.KeyTokenModel.findOne({ user: userId });
    }
    static async removeKeyById(_id) {
        return keyToken_model_1.KeyTokenModel.findByIdAndDelete({ _id });
    }
    static async findByRefreshToken(refreshToken) {
        return keyToken_model_1.KeyTokenModel.findOne({ refreshToken });
    }
    static async findByRefreshTokenUsed(refreshToken) {
        return await keyToken_model_1.KeyTokenModel.findOne({ refreshTokenUsed: { $in: refreshToken } }).lean();
    }
    static async removeKeyByUserId(userId) {
        console.log(userId);
        return keyToken_model_1.KeyTokenModel.findOneAndDelete({ user: userId });
    }
}
exports.KeyTokenService = KeyTokenService;
