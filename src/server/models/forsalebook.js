"use strict";

let mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

let ForSaleBook = new Schema({
    'ISBN': {type: String, required: true, ref: 'BookInfo'},
    'price': {type: Number, required: true},
    'seller': {type: String, required: true, ref: 'User'},
    'school': {type: String, required: true},
});


module.exports = mongoose.model('ForSaleBook', ForSaleBook);