'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var projectController = require('../controllers/projectController');

var api = express.Router();

api.post('/addProject', md_auth.ensureAuth, projectController.addProject);

module.exports = api;