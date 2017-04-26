var express = require('express');
var multer = require('multer');
var router = express.Router();
var categoryService = require('../services/categories.service');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/iconCategory');
    },
    filename: function(req, file, cb) {
        var categoryId = req.body.categoryId;
        var path = file.fieldname + '-' + categoryId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        categoryService.updateCategoryIcon(userId, path)
            .then(function() {
                res.sendStatus(200);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('icon');

router.post('/upload', upload, function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: 'Category Icon successfully uploded' });
    });
});

module.exports = router;