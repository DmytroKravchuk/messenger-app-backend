import {IRegistrationParams, IUsersSearchParams} from "./user-service.types";
const registrationValidation = require("../validation/user-service-validation");
const UserModel = require("../../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
// @ts-ignore
const tokenService = require("../token-service");
const UserDto = require("../../dtos/user-dto");
// @ts-ignore
const ApiError = require("../../exceptions/api-error");

class UserService {
    async registration(params: IRegistrationParams) {
        const {
            email,
            password,
            firstName,
            secondName,
        } = params;

        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`User with this email: ${email}, already exist`);
        }
        registrationValidation(params);
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({
            email,
            firstName,
            secondName,
            password: hashPassword,
            activationLink, isActivated: true
        });
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest("Incorrect activation link");
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email: String, password: String) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest("User is not found");
        }
        const isPasswordEquals = await bcrypt.compare(password, user.password);
        if (!isPasswordEquals) {
            throw ApiError.BadRequest("Incorrect Password");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken: String) {
        return tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: String) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async postUsers(data: IUsersSearchParams) {
        const {search, limit} = data;
        const users = await UserModel.find().or([
            {
                firstName: { $regex: search }
            },
            {
                secondName: { $regex: search }
            },
            {
                email: { $regex: search }
            }
        ]).limit(limit || 20);
        return users.map((user: any) => new UserDto(user));
    }
}

module.exports = new UserService();