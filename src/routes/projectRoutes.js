'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var projectController = require('../controllers/projectController');

var api = express.Router();

api.post('/addProject', md_auth.ensureAuth, projectController.addProject);
api.get('/:id', md_auth.ensureAuth, projectController.getProjects);
api.put('/:id', md_auth.ensureAuth, projectController.editProject);
api.delete('/:id/deleteProject', md_auth.ensureAuth, projectController.deleteProject);

module.exports = api;
