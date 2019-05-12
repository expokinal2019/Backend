'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var LabelController=require('../controllers/labelController')

var api = express.Router();
api.post('/createLabel', md_auth.ensureAuth, LabelController.createLabel);
api.put('/editLabel/:id', md_auth.ensureAuth, LabelController.editLabel);
api.delete('/deleteLabel/:id', md_auth.ensureAuth, LabelController.deleteLabel);
api.get('/getLabels',md_auth.ensureAuth,LabelController.getLabels)

module.exports = api;