'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var labelSchema = Schema({
    name: String,
    color: String
});

module.exports = mongoose.model('Label', labelSchema);