'use strict'

var express = require('express');
var userController = require('../controllers/userController');
var md_auth = require('../middlewares/authentication');

//SUBIR IMAGEN
var multipartyes = require('connect-multiparty');
var md_subir = multipartyes({ uploadDir: './src/uploads/users' })

var api = express.Router();

api.post('/sign-up', userController.signUp);
api.post('/login', userController.login);
api.put('/:id', md_auth.ensureAuth, userController.editUser);
api.delete('/:id', md_auth.ensureAuth, userController.deleteUser);
api.post('/:id/subir-imagen', [md_auth.ensureAuth, md_subir], userController.uploadImage);
api.get('/:nameImage', userController.getImage);
api.get('/test/test', (req, res) => res.status(200).send({message: 'test'}));

module.exports = api;
