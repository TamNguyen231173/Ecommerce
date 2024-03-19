"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("~/services/auth.service");
class AuthController {
    static async login(req, res) {
        const data = await auth_service_1.AuthService.login(req.body);
        return res.status(200).json({
            message: 'Login successfully',
            data
        });
    }
    static async register(req, res) {
        const data = await auth_service_1.AuthService.register(req.body);
        return res.status(200).json({
            message: 'Register successfully',
            data
        });
    }
    static async logout(req, res) {
        const data = await auth_service_1.AuthService.logout(req.keyStore);
        return res.status(200).json({
            message: 'Logout successfully',
            data
        });
    }
    static async refreshToken(req, res) {
        const data = await auth_service_1.AuthService.refreshToken({
            refreshToken: req.refreshToken,
            keyStore: req.keyStore,
            user: req.user
        });
        return res.status(200).json({
            message: 'Refresh token successfully',
            data
        });
    }
}
exports.AuthController = AuthController;
