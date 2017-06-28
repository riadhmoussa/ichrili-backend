var express = require('express');
var router = express.Router();
var passport = require('passport');
var cors = require('cors');

module.exports = function(passport) {
    router.use(cors());
    // send to facebook to do the authentication
    router.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );

    router.get('/unlink/facebook', function(req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.send({ error: err, 'message': 'User not successfully unliked (facebbok unlink)' });
        });
    });



    return router;
};