var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/schemas/users');
var fbConfig = require('../_config').facebookAuth;

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
            clientID: fbConfig.clientID,
            clientSecret: fbConfig.clientSecret,
            callbackURL: fbConfig.callbackURL,
            profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email'],
            passReqToCallback: true
        },

        // facebook will send back the tokens and profile
        function(request, access_token, refresh_token, profile, done) {
            // asynchronous
            process.nextTick(function() {
                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id': profile.id }, function(err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);
                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();
                        // set all of the facebook information in our user model
                        console.log(profile);
                        newUser.id = profile.id;
                        newUser.firstName = profile._json.first_name;
                        newUser.lastName = profile._json.last_name;
                        newUser.username = profile._json.first_name + ' ' + profile._json.last_name;
                        newUser.email = profile.email;
                        newUser.facebook.id = profile.id; // set the users facebook id	                
                        newUser.facebook.access_token = access_token; // we will save the token that facebook provides to the user	                
                        newUser.facebook.firstName = profile._json.first_name;
                        newUser.facebook.lastName = profile._json.last_name; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile._json.email; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};