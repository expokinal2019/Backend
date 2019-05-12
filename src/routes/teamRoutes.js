'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var teamController = require('../controllers/teamController');

var api = express.Router();

api.post('/createTeam', md_auth.ensureAuth, teamController.createTeam);
api.put('/addIntegrant/:teamId/:integrantId', md_auth.ensureAuth, teamController.addIntegrant);
api.delete('/deleteTeam/:teamId', md_auth.ensureAuth, teamController.deleteTeam);
api.delete('/removeIntegrant/:teamId/:integrantId', md_auth.ensureAuth, teamController.removeIntegrant);

module.exports = api;