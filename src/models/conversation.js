'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = Schema({
    from: { type: Schema.Types.ObjectId, ref: 'user' },
    to: { type: Schema.Types.ObjectId, ref: 'user' },
    message: [
        content = String,
        status = { type: String, default: 'UNREAD' }
    ]
});

module.exports = mongoose.model('Converstion', conversationSchema);