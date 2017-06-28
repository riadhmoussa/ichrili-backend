require('rootpath')();
var config = require('./config.json');
var express = require('express');
var expressSession = require('express-session');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');

mongoose.connect(config.connectionString);

var passport = require('passport');
var expressSession = require('express-session');

// Initialize Passport
var initPassport = require('./authentication/passport/init');
initPassport(passport);

// TODO - Why Do we need this key ?
// required for passport
app.use(expressSession({
    secret: 'ilovemahdiamynativetown', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// use JWT auth to secure the api
//app.use(expressJwt({ secret: config.secret }).unless({
//    path: ['/users/authenticate',
//        '/users/register', '/avatar/upload',
//        '/category/upload', '/market/upload',
//        '/auth/facebook', '/login/facebook', '/auth/facebook/callback',
//        '/auth/twitter', '/login/twitter', '/auth/twitter/callback',
//        '/auth/google', '/login/google', '/auth/google/callback',
//        new RegExp('/uploads/avatars.*/', 'i'),
//        new RegExp('/uploads/categoryicons.*/', 'i'),
//        new RegExp('/uploads/marketlogos.*/', 'i')
//   ]
//}));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/categories', require('./controllers/categories.controller'));
app.use('/markets', require('./controllers/markets.controller'))

// User Avatar API Entry Point
app.use('/avatar', require('./controllers/avatar.controller'));
app.use("/uploads/avatars", express.static(path.join(__dirname, 'uploads/avatars')));

// Category API EntryPoint
app.use('/category', require('./controllers/icon_category.controller'));
app.use("/uploads/categoryicons", express.static(path.join(__dirname, 'uploads/categoryicons')));

// Market Logo API Entry Point
app.use('/market', require('./controllers/logo_market.controller'));
app.use("/uploads/marketlogos", express.static(path.join(__dirname, 'uploads/marketlogos')));


app.use('/', require('./authentication/api/facebook')(passport));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});