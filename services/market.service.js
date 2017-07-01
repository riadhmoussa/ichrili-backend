var config = require('../config.json');
var _ = require('lodash');
var Market = require('../models/schemas/markets');
var Q = require('q');
var mongoose = require('mongoose');


var service = {};
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.updateLogo = updateLogo;

module.exports = service;


function getAll() {
    var deferred = Q.defer();
    Market.find((err, markets) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(markets);
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    Market.findById(_id, function(err, markets) {
        if (err) deferred.reject(err.name + ': ' + err.message);
    });
    return deferred.promise;
}

function create(marketParam) {
    var deferred = Q.defer()
    var market = marketParam;
    Market.insert(
        market,
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}

function update(_id, marketParam) {
    var deferred = Q.defer();

    // validation
    Market.findById(_id, function(err, market) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (market.market_name !== marketParam.market_name) {
            // market has changed so check if the new market_name is already taken
            Market.findOne({ market_name: marketParam.market_name },
                function(err, market) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (market) {
                        // market_name already exists
                        deferred.reject('market "' + req.body.market_name + '" is already taken')
                    } else {
                        updateMarket();
                    }
                });
        } else {
            updateMarket();
        }
    });

    function updateMarket() {
        // fields to update
        var set = {
            market_name: marketParam.market_name,
            address: marketParam.address,
            city: marketParam.city,
            position: marketParam.position
        };

        Market.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set },
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    Market.remove({ _id: mongo.helper.toObjectID(_id) },
        function(err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });

    return deferred.promise;
}

function updateLogo(_id, path) {
    var deferred = Q.defer();
    Market.update({ _id: mongo.helper.toObjectID(_id) }, { $set: { logo_url: path } },
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}