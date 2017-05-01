var config = require('../config');
var express = require('express');
var router = express.Router();
var marketService = require('../services/market.service');

// routes
router.post('/add', addMarket);
router.get('/', getAll);
router.get('/current/:id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function addMarket(req, res) {
    console.log('req.body : ', req.body);
    marketService.create(req.body)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    marketService.getAll()
        .then(function(markets) {
            res.send(markets);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    marketService.getById(req.params.id)
        .then(function(market) {
            if (market) {
                res.send(market);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    marketService.update(req.params._id, req.body)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    marketService.delete(req.params._id)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}