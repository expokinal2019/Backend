'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var taskController = require('../controllers/taskController');

var api = express.Router();

api.post('/addTask', md_auth.ensureAuth, taskController.addTask);

module.exports = api;