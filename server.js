require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// use JWT auth to secure the api
app.use(expressJwt({ secret: config.secret }).unless({
    path: ['/users/authenticate',
        '/users/register', '/avatar/upload',
        new RegExp('/uploads/avatars.*/', 'i')
    ]
}));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/avatar', require('./controllers/avatar.controller'));
app.use("/uploads/avatars", express.static(path.join(__dirname, 'uploads/avatars')));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});