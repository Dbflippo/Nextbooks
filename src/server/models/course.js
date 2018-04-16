"use strict";

let mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

let Course = new Schema({
    'school': {type: String, required: true},
    'department': {type: String, required: true},
    'number': {type: String, required: true},
    'name': {type: String, required: true},
    'professor': {type: String},
    'book': {type: String},
});


module.exports = mongoose.model('Course', Course);