var mongoose = require('mongoose');
var schema = mongoose.Schema;
var _ = require('lodash');

var categorieSchema = new schema({
    category_label: { type: String, required: true },
    store: { type: String, required: true },
    icon_url: { type: String }
})


// create the model for Categories and expose it to our app
module.exports = mongoose.model('Categorie', categorieSchema);