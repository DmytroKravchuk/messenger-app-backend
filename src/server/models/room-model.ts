// @ts-ignore
const {Schema, model} = require("mongoose");

const RoomSchema = new Schema({
    name: {type: String, required: true},
    avatar: Buffer,
    unreadCountMessages: Number,
    usersIds: [{type: Schema.Types.ObjectId, unique: true, required: true}],
    messages: [
        {
            author: { type: String },
            message: { type: String },
            createdAt: { type: Number },
            updatedAt: { type: Number }
        }
    ]
});

module.exports = model("Room", RoomSchema);