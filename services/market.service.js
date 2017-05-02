var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var json2mongo = require('json2mongo');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('markets');


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
    db.markets.find().toArray(function(err, markets) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(markets);
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.markets.findById(_id, function(err, markets) {
        if (err) deferred.reject(err.name + ': ' + err.message);
    });
    return deferred.promise;
}

function create(marketParam) {
    var deferred = Q.defer()
    var market = marketParam;
    db.markets.insert(
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
    db.markets.findById(_id, function(err, market) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (market.market_name !== marketParam.market_name) {
            // market has changed so check if the new market_name is already taken
            db.markets.findOne({ market_name: marketParam.market_name },
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

        db.markets.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set },
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.markets.remove({ _id: mongo.helper.toObjectID(_id) },
        function(err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });

    return deferred.promise;
}

function updateLogo(_id, path) {
    var deferred = Q.defer();
    db.markets.update({ _id: mongo.helper.toObjectID(_id) }, { $set: { logo_url: path } },
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}