module.exports = class RoomDto {
    _id;
    name;
    avatar;
    messages;
    unreadCountMessages;
    usersIds;

    constructor(model: any) {
        this._id = model._id;
        this.name = model.name;
        this.avatar = model.avatar;
        this.messages = model.messages;
        this.unreadCountMessages = model.unreadCountMessages;
        this.usersIds = model.usersIds;
    }
}