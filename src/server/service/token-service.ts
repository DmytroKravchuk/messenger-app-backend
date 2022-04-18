const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_TOKEN, {expiresIn: "15m"});
        const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_REFRESH_TOKEN, {expiresIn: "30d"});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: String) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET_TOKEN);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: String) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_REFRESH_TOKEN);
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: any, refreshToken: string) {
        const tokenData = await tokenModel.findOne({user: userId});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken: String) {
        const res = await tokenModel.deleteOne({refreshToken});
        return res;
    }

    async findToken(refreshToken: String) {
        const token = await tokenModel.findOne({refreshToken});
        return token;
    }
}

module.exports = new TokenService();