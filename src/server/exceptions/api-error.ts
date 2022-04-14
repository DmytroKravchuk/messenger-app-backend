module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status: Number, message: any, errors: [] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, "User is not authorized!")
    }

    static BadRequest(message: any, errors?: []) {
        return new ApiError(400, message, errors)
    }
}