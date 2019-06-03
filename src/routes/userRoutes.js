'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var md_auth = require('../middlewares/authentication');

//SUBIR IMAGEN
var multipartyes = require('connect-multiparty');
var md_subir = multipartyes({ uploadDir: './src/uploads/users' })

var api = express.Router();

api.post('/sign-up', UserController.signUp);
api.post('/login', UserController.login);
api.put('/edit-user/:id', md_auth.ensureAuth, UserController.editUser);
api.delete('/delete-user/:id', md_auth.ensureAuth, UserController.deleteUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_subir], UserController.uploadImage);
api.get('/image-user/:nameImage', UserController.getImage)

module.exports = api;