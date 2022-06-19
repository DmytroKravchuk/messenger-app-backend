export interface IRegistrationParams {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    secondName: string;
}

export interface IUsersSearchParams {
    search: string;
    limit: number;
}