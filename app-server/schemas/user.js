"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    landingPageUrl: String,
    email: String,
    fullName: String,
    phone: String,
    createdAt: Date,
});
// Before
exports.userSchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', exports.userSchema);
// make this available to our users in our Node applications
module.exports = User;
