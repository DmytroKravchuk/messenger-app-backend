"use strict";
// @ts-ignore
const { Schema, model } = require("mongoose");
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true, trim: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    contacts: { type: Array, required: true },
});
module.exports = model("User", UserSchema);
