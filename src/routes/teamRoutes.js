'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var teamController = require('../controllers/teamController');

var api = express.Router();

api.post('/create', md_auth.ensureAuth, teamController.createTeam);
api.put('/:teamId/addIntegrant/:integrantId', md_auth.ensureAuth, teamController.addIntegrant);
api.delete('/:teamId', md_auth.ensureAuth, teamController.deleteTeam);
api.delete('/:teamId/removeIntegrant/:integrantId', md_auth.ensureAuth, teamController.removeIntegrant);

module.exports = api;
