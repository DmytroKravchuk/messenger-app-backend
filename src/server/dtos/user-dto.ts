module.exports = class UserDto {
    _id;
    email;
    firstName;
    secondName;
    roomsIds;

    constructor(model: any) {
        this.email = model.email;
        this._id = model._id;
        this.firstName = model.firstName;
        this.secondName = model.secondName;
        this.roomsIds = model.roomsIds;
    }
}