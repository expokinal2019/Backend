'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var taskController = require('../controllers/taskController');

var api = express.Router();

api.post('/task', md_auth.ensureAuth, taskController.addTask);
api.get('/task/:id', md_auth.ensureAuth, taskController.getTask);
api.put('/task/:id', md_auth.ensureAuth, taskController.editTask);
api.delete('/task/:id', md_auth.ensureAuth, taskController.deleteTask);

module.exports = api;
