'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var teamController = require('../controllers/teamController');

var api = express.Router();

api.post('/team/create', md_auth.ensureAuth, teamController.createTeam);
api.put('/team/:teamId/addIntegrant/:integrantId', md_auth.ensureAuth, teamController.addIntegrant);
api.delete('/team/:teamId', md_auth.ensureAuth, teamController.deleteTeam);
api.delete('/team/:teamId/removeIntegrant/:integrantId', md_auth.ensureAuth, teamController.removeIntegrant);

module.exports = api;
