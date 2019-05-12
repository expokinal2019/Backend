'use strict'

var Project = require('../models/project');

function addProject(req, res) {
    var params = req.body;
    var project = new Project();

    if (params.name && params.description && params.developerTeam) {
        project.name = params.name;
        project.description = params.description;
        project.developerTeam = params.developerTeam;
        project.files = null;

        project.save((err, storedProject) => {
            if (err) return res.status(500).send({ message: 'Error at saving project' });

            if (!storedProject) {
                return res.status(500).send({ message: 'Project could no be saved' });
            } else {
                return res.status(200).send({ project: storedProject });
            }
        })
    } else {
        return res.status(500).send({ message: 'Fill all the required fields before creating the project' })
    }
}

module.exports = {
    addProject
}