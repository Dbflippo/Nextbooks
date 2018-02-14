"use strict";

let mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

let InfoBook = new Schema({
    'ISBN': {type: String, required: true, index: {unique: true}},
    'author': {type: String, required: true},
    'title': {type: String, required: true},
    'edition': {type: String},
    'for_sale': [{type: Schema.Types.ObjectId, ref: 'BookForSale'}],
});

module.exports = mongoose.model('InfoBook', InfoBook);
