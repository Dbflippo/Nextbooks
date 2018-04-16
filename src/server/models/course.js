"use strict";

let mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

let Course = new Schema({
    'school': {type: String, required: true},
    'department': {type: String, required: true},
    'number': {type: String, required: true},
    'name': {type: String, required: true},
    'professor': {type: String},
    'books': [{type: Schema.Types.ObjectId, ref: 'InfoBook'}]
});


module.export= mongoose.model('Course', Course);