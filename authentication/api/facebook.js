var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticationHelpers = require('../authenticationHelpers');

var isAuthenticated = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/login');
}

module.exports = function(passport) {

    // send to facebook to do the authentication
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));

    // route for facebook authentication and login
    // different scopes while logging in
    router.get('/login/facebook',
        passport.authenticate('facebook', { scope: 'email', }));

    // handle the callback after facebook has authenticated the user
    router.get('/login/facebook/callback',
        passport.authenticate('facebook', function(req, res) {
            res.send(req.user);
        })
    );

    router.get('/unlink/facebook', isAuthenticated, function(req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.send({ error: err, 'message': 'User not successfully unliked (facebbok unlink)' });
        });
    });
    return router;
}