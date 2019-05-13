'use strict'

var Project = require('../models/project');

function addProject(req, res) {
    var params = req.body;
    var projectOwner = req.params.userId;
    var project = new Project();

    if (params.name && params.description && params.developerTeam) {
        project.projectOwner = projectOwner;
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

function editProject(req, res) {
    var params = req.body;
    var projectId = req.params.projectId;

    Project.findByIdAndUpdate(projectId, params, {new: true}, (err, updatedProject) => {
        if (err) return res.status(500).send({message: 'Error in update request'});

        if (!updatedProject) {
            return res.status(500).send({message: 'Project could not be updated'});
        } else {
            return res.status(200).send({project: updatedProject});
        }
    })
}

function getProjects(req, res) {
    var projectOwner = req.params.id;

    Project.find({'projectOwner': projectOwner}).exec((err, projects) => {
        if (err) return res.status(500).send({message: 'error in find request'});

        if (!projects) {
            return res.status(500).send({message: 'There are no projects to list'});
        } else {
            return res.status(200).send({projects: projects});
        }
    });
}

function deleteProject(req, res) {
    var projectId = req.params.id;

    Project.findByIdAndDelete(projectId, (err, deletedProject) => {
        if (err) return res.status(500).send({message: 'Error in delete request'});

        if (!deletedProject) {
            return res.status(500).send({message: 'Project could not be deleted'});
        } else {
            return res.status(200).send({message: 'Project deleted successfully'});
        }
    })
}

module.exports = {
    addProject,
    editProject,
    getProjects,
    deleteProject
}