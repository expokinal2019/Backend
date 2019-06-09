'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var taskController = require('../controllers/taskController');

var api = express.Router();

api.post('/', md_auth.ensureAuth, taskController.addTask);
api.get('/:id', md_auth.ensureAuth, taskController.getTask);
api.put('/:id', md_auth.ensureAuth, taskController.editTask);
api.delete('/:id', md_auth.ensureAuth, taskController.deleteTask);

module.exports = api;
