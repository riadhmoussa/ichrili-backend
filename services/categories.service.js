var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('categories');

var service = {};
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.updateIcon = updateIcon;

module.exports = service;


function getAll() {
    var deferred = Q.defer();

    db.categories.find().toArray(function(err, categories) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(categories);
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.categories.findById(_id, function(err, categories) {
        if (err) deferred.reject(err.name + ': ' + err.message);
    });
    return deferred.promise;
}

function create(categoryParam) {
    var deferred = Q.defer();
    // validation
    db.categories.findOne({ category_label: categoryParam.category_label },
        function(err, category) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (category) {
                // category_label already exists
                deferred.reject('category "' + categoryParam.category_label + '" is already taken');
            } else {
                createCategory();
            }
        });

    function createCategory() {
        var category = categoryParam;
        db.categories.insert(
            category,
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, categoryParam) {
    var deferred = Q.defer();

    // validation
    db.categories.findById(_id, function(err, category) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (category.category_label !== categoryParam.category_label) {
            // category has changed so check if the new category_label is already taken
            db.categories.findOne({ category_label: categoryParam.category_label },
                function(err, category) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (category) {
                        // category_label already exists
                        deferred.reject('Category "' + req.body.category_label + '" is already taken')
                    } else {
                        updateCategory();
                    }
                });
        } else {
            updateCotegory();
        }
    });

    function updateCategory() {
        // fields to update
        var set = {
            category_label: categoryParam.category_label,
            store: categoryParam.store
        };

        db.categories.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set },
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.categories.remove({ _id: mongo.helper.toObjectID(_id) },
        function(err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });

    return deferred.promise;
}

function updateIcon(_id, path) {
    var deferred = Q.defer();
    db.categories.update({ _id: mongo.helper.toObjectID(_id) }, { $set: { icon_url: path } },
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}