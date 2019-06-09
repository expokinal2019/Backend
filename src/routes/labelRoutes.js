'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var LabelController=require('../controllers/labelController')

var api = express.Router();

api.get('/label',md_auth.ensureAuth,LabelController.getLabels);
api.post('/label', md_auth.ensureAuth, LabelController.createLabel);
api.put('/label/:id', md_auth.ensureAuth, LabelController.editLabel);
api.delete('/label/:id', md_auth.ensureAuth, LabelController.deleteLabel);

module.exports = api;
