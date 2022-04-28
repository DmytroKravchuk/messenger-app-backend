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
const UserModel = require("../models/user-model");
const mailService = require("./mail-service");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
// @ts-ignore
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
// @ts-ignore
const ApiError = require("../exceptions/api-error");
class UserService {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield UserModel.findOne({ email });
            if (candidate) {
                throw ApiError.BadRequest(`User with this email: ${email}, already exist`);
            }
            const hashPassword = yield bcrypt.hash(password, 3);
            const activationLink = uuid.v4();
            const user = yield UserModel.create({ email, password: hashPassword, activationLink, isActivated: true });
            // await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`); Todo: will be implemented soon
            const userDto = new UserDto(user); // id, email, isActivated
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel.findOne({ activationLink });
            if (!user) {
                throw ApiError.BadRequest("Incorrect activation link");
            }
            user.isActivated = true;
            yield user.save();
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel.findOne({ email });
            if (!user) {
                throw ApiError.BadRequest("User is not found");
            }
            const isPasswordEquals = yield bcrypt.compare(password, user.password);
            if (!isPasswordEquals) {
                throw ApiError.BadRequest("Incorrect Password");
            }
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return tokenService.removeToken(refreshToken);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = yield tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError();
            }
            const user = yield UserModel.findById(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserModel.find();
            return users.map((user) => new UserDto(user));
        });
    }
}
module.exports = new UserService();
