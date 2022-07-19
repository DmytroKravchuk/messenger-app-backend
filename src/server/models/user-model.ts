// @ts-ignore
const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true, trim: true},
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roomsIds: [{type: Schema.Types.ObjectId}],
});

module.exports = model("User", UserSchema);