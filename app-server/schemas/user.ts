var mongoose = require('mongoose');
import { Schema } from "mongoose";

export var userSchema: Schema = new Schema({
    landingPageUrl: String,
    email: String,
    fullName: String,
    phone: String,
    createdAt: Date,
});

// Before
userSchema.pre("save", function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;