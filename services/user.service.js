var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../models/schemas/users');
var Q = require('q');
var mongo = require('mongoskin');
var mongoose = require('mongoose');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.updateAvatar = updateAvatar;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    User.findOne({ username: username }, function(err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar_url: user.avatar_url,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    User.find((function(err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function(user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    }));

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    User.findOne({ username: userParam.username },
        function(err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        var newUser = new User();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.username = user.username;
        newUser.hash = bcrypt.hashSync(userParam.password, 10);
        newUser.save(function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            User.findOne({ username: userParam.username },
                function(err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
            email: userParam.email,
            mobile: userParam.mobile,
            gender: userParam.gender,
            adress: userParam.adress,
            city: userParam.city,
            country: userParam.country
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        User.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set },
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    User.remove({ _id: mongo.helper.toObjectID(_id) },
        function(err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function updateAvatar(_id, path) {
    var deferred = Q.defer();
    User.findByIdAndUpdate(_id, { $set: { avatar_url: path } },
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}