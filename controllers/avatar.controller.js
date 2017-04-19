var express = require('express');
var multer = require('multer');
var router = express.Router();
var userSevice = require('../services/user.service');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/avatars');
    },
    filename: function(req, file, cb) {
        var userId = req.body.userId;
        // var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + userId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('avatar');

router.post('/upload', upload, function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }

        res.json({ error_code: 0, err_desc: null });
    });;
});

module.exports = router;