'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var labelSchema = Schema({
    // @TODO Deberiamos asociar las etiquetas a un proyecto.
    // De lo contrario son universales para todos los usuario.
    name: String,
    color: String
});

module.exports = mongoose.model('Label', labelSchema);
