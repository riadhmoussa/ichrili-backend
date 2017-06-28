var mongoose = require('mongoose');
var schema = mongoose.Schema;
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var Q = require('q');

var userSchema = new schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String },
    mobile: { type: String },
    gender: { type: String },
    adress: { type: String },
    city: { type: String },
    country: { type: String },
    hash: { type: String },
    avatar_url: { type: String },

    local: {
        name: String,
        email: String,
        password: String,
    },

    facebook: {
        id: String,
        access_token: String,
        firstName: String,
        lastName: String,
        email: String
    },
    twitter: {
        id: String,
        token: String,
        username: String,
        displayName: String,
        lastStatus: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

})

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);