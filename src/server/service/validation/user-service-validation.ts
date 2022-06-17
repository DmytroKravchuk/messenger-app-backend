// @ts-ignore
import {IRegistrationParams} from "../user-service/user-service.types";

const ApiError = require("../../exceptions/api-error");

module .exports = function registrationValidation(params: IRegistrationParams) {
    const {
        email,
        password,
        confirmPassword,
        firstName,
        secondName,
    } = params;
    if (!email || !password || !confirmPassword || !firstName || !secondName) {
        throw ApiError.BadRequest(`Please input all required fields!`);
    }
    if (password !== confirmPassword) {
        throw ApiError.BadRequest(`The two passwords that you entered do not match!`);
    }
};