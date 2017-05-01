var config = require('../config');
var express = require('express');
var router = express.Router();
var categoryService = require('../services/categories.service');

// routes
router.post('/add', addCategory);
router.get('/', getAll);
router.get('/current/:id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function addCategory(req, res) {
    categoryService.create(req.body)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    categoryService.getAll()
        .then(function(categories) {
            res.send(categories);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    categoryService.getById(req.params.id)
        .then(function(category) {
            if (category) {
                res.send(category);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    categoryService.update(req.params._id, req.body)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    categoryService.delete(req.params._id)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}