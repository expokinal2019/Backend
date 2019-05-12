'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var teamController = require('../controllers/teamController');

var api = express.Router();

api.post('/createTeam', md_auth.ensureAuth, teamController.createTeam);
api.put('/addIntegrant/:teamId/:integrantId', md_auth.ensureAuth, teamController.addIntegrant);

module.exports = api;