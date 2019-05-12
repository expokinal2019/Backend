'use strict'

var express = require('express');
var userController = require('../controllers/userController');

var api = express.Router();

api.post('/sign-up', userController.signUp);
api.post('/login', userController.login);

module.exports = api;