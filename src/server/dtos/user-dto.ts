module.exports = class UserDto {
    email;
    firstName;
    secondName;
    id;
    contacts;

    constructor(model: any) {
        this.email = model.email;
        this.id = model._id;
        this.firstName = model.firstName;
        this.secondName = model.secondName;
        this.contacts = model.contacts;
    }
}