'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var projectController = require('../controllers/projectController');

var api = express.Router();

api.post('/project', md_auth.ensureAuth, projectController.addProject);
api.get('/project/:id', md_auth.ensureAuth, projectController.getProjects);
api.put('/project/:id', md_auth.ensureAuth, projectController.editProject);
api.delete('/project/:id', md_auth.ensureAuth, projectController.deleteProject);

module.exports = api;
