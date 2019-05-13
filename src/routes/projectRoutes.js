'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var projectController = require('../controllers/projectController');

var api = express.Router();

api.post('/addProject', md_auth.ensureAuth, projectController.addProject);
api.get('/getProjects/:id', md_auth.ensureAuth, projectController.getProjects);
api.put('/editProject/:id', md_auth.ensureAuth, projectController.editProject);
api.delete('/deleteProject/:id', md_auth.ensureAuth, projectController.deleteProject);

module.exports = api;