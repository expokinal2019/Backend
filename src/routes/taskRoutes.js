'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var taskController = require('../controllers/taskController');

var api = express.Router();

api.post('/addTask', md_auth.ensureAuth, taskController.addTask);
api.get('/getTask/:id', md_auth.ensureAuth, taskController.getTask);
api.put('/editTask/:id', md_auth.ensureAuth, taskController.editTask);
api.delete('/deleteTask/:id', md_auth.ensureAuth, taskController.deleteTask);

module.exports = api;