'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = Schema({
    name: String,
    description: String,
    developerTeam: { type: Schema.Types.ObjectId, ref: 'team' },
    files: []
});

module.exports = mongoose.model('Project', projectSchema);