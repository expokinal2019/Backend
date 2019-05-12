'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var userRoutes = require('./routes/userRoutes');
var projectRoutes = require('./routes/projectRoutes');
var taskRoutes = require('./routes/taskRoutes');
var labelRoutes = require('./routes/labelRoutes');
var teamRoutes = require('./routes/teamRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Controll-Allow-Request-Method');
    res.header('Access-Controll-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api', userRoutes, teamRoutes, projectRoutes, labelRoutes, taskRoutes);

module.exports = app;