'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var teamController = require('../controllers/teamController');

var api = express.Router();

api.post('/', md_auth.ensureAuth, teamController.createTeam);
api.delete('/:teamId', md_auth.ensureAuth, teamController.deleteTeam);

api.put('/addIntegrant/:teamId/:integrantId', md_auth.ensureAuth, teamController.addIntegrant);
api.delete('/removeIntegrant/:teamId/:integrantId', md_auth.ensureAuth, teamController.removeIntegrant);

module.exports = api;
