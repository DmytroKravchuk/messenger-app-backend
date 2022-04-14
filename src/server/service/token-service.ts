const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_TOKEN, {expiresIn: "30m"});
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

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await tokenModel.findOne({user: userId});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken: String) {
        await tokenModel.deleteOne({refreshToken});
    }

    async findToken(refreshToken: String) {
        await tokenModel.findOne({refreshToken});
    }
}

module.exports = new TokenService();