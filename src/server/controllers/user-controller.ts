const userService = require("../service/user-service");
const {validationResult} = require("express-validator");
// @ts-ignore
const ApiError = require("../exceptions/api-error");

class UserController {
    async registration(req: any, res: any, next: any) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error...", errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e: any) {
            next(e);
        }
    }

    async login(req: any, res: any, next: any) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e: any) {
            next(e);
        }
    }

    async logout(req: any, res: any, next: any) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        } catch (e: any) {
            next(e);
        }
    }

    async activate(req: any, res: any, next: any) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e: any) {
            next(e);
        }
    }

    async refresh(req: any, res: any, next: any) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e: any) {
            next(e);
        }
    }

    async getUsers(req: any, res: any, next: any) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (e: any) {
            next(e);
        }
    }
}

module.exports = new UserController();