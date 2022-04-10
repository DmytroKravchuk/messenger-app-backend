"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_TOKEN, { expiresIn: "30m" });
        const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_REFRESH_TOKEN, { expiresIn: "30d" });
        return {
            accessToken,
            refreshToken
        };
    }
    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET_TOKEN);
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_REFRESH_TOKEN);
        }
        catch (e) {
            return null;
        }
    }
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield tokenModel.findOne({ user: userId });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            return yield tokenModel.create({ user: userId, refreshToken });
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield tokenModel.deleteOne({ refreshToken });
        });
    }
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield tokenModel.findOne({ refreshToken });
        });
    }
}
module.exports = new TokenService();
