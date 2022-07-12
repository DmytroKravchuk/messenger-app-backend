"use strict";
module.exports = class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.firstName = model.firstName;
        this.secondName = model.secondName;
        this.contacts = model.contacts;
    }
};
