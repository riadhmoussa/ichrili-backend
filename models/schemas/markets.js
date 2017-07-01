var mongoose = require('mongoose');
var schema = mongoose.Schema;
var _ = require('lodash');

var adressSchema = new schema({
    adress1: { type: String },
    adress2: { type: String },
    postalCode: { type: String }

});

var positionSchema = new schema({
    latitude: { type: String },
    longitude: { type: String }
});

var marketSchema = new schema({
    market_name: { type: String, required: true },
    city: { type: String, required: true },
    adress: adressSchema,
    position: positionSchema,
    logo_url: { type: String }
});



// create the model for Market and expose it to our app
module.exports = mongoose.model('Market', marketSchema);