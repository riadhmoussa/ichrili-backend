var config = require('../config.json');
var _ = require('lodash');
var Categorie = require('../models/schemas/categories');
var Q = require('q');
var mongoose = require('mongoose');


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

    Categorie.find((err, categories) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(categories);
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    Categorie.findById(_id, function(err, categories) {
        if (err) deferred.reject(err.name + ': ' + err.message);
    });
    return deferred.promise;
}

function create(categoryParam) {
    var deferred = Q.defer();
    // validation
    Categorie.findOne({ category_label: categoryParam.category_label },
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
        Categorie.insert(
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
    Categorie.findById(_id, function(err, category) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (category.category_label !== categoryParam.category_label) {
            // category has changed so check if the new category_label is already taken
            Categorie.findOne({ category_label: categoryParam.category_label },
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

        Categorie.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set },
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    Categorie.remove({ _id: mongo.helper.toObjectID(_id) },
        function(err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });

    return deferred.promise;
}

function updateIcon(_id, path) {
    var deferred = Q.defer();
    Categorie.update({ _id: mongo.helper.toObjectID(_id) }, { $set: { icon_url: path } },
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}