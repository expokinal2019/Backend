'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var taskController = require('../controllers/taskController');

var api = express.Router();

api.post('/', md_auth.ensureAuth, taskController.addTask);
api.get('/', md_auth.ensureAuth, taskController.getTasks);
api.get('/:id', md_auth.ensureAuth, taskController.getTask);
api.put('/:id', md_auth.ensureAuth, taskController.editTask);
api.delete('/:id', md_auth.ensureAuth, taskController.deleteTask);

api.get('/owner/:ownerId', taskController.getTasksByOwner);
api.get('/owner-name/:ownerName', taskController.getTasksByOwnerName);
api.get('/:idProject/getAllTasks',md_auth.ensureAuth,taskController.getAllTasks)
api.get('getTasksByDate/:date', md_auth.ensureAuth, taskController.getTasksByDate);
api.get('getTasksByStatus/:status', md_auth.ensureAuth, taskController.getTasksByStatus);
api.get('getTasksByLabels/:labels', md_auth.ensureAuth, taskController.getTasksByLabels);
api.get('getPendingTasks/:projectId', md_auth.ensureAuth, taskController.getPendingTasks);
api.get('test', (req, res) => res.status(200).send('test!'));
    
module.exports = api;
