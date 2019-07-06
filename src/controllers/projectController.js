'use strict'

var Project = require('../models/project');

function addProject(req, res) {
    var params = req.body;
    var projectOwner = req.user.sub;
    var project = new Project();

    if (params.name && params.description && params.developerTeam) {
        project.projectOwner = projectOwner;
        project.name = params.name;
        project.description = params.description;
        project.developerTeam = params.developerTeam;
        project.files = null;

        project.save((err, storedProject) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (!storedProject) {
                return res.status(404).send({ message: 'El proyecto no pudo ser guardado' });
            } else {
                return res.status(200).send({ project: storedProject });
            }
        })
    } else {
        return res.status(500).send({ message: 'Debe llenar todos los datos' })
    }
}

function editProject(req, res) {
    var params = req.body;
    var projectId = req.params.id;

    Project.findByIdAndUpdate(projectId, params, {new: true}, (err, updatedProject) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!updatedProject) {
            return res.status(500).send({message: 'El proyecto no pudo ser actualizado'});
        } else {
            return res.status(200).send({project: updatedProject});
        }
    })
}

function getProjects(req, res) {
    var projectOwner = req.user.sub;

    Project.find({'projectOwner': projectOwner}).exec((err, projects) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!projects) {
            return res.status(404).send({message: 'No se han podido obtener los proyectos'});
        } else {
            return res.status(200).send({projects: projects});
        }
    });
}

function deleteProject(req, res) {
    var projectId = req.params.id;

    Project.findByIdAndDelete(projectId, (err, deletedProject) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!deletedProject) {
            return res.status(500).send({message: 'El proyecto no pudo ser eliminado'});
        } else {
            return res.status(200).send({project: 'Proyecto eliminado correctamente'});
        }
    })
}

module.exports = {
    addProject,
    editProject,
    getProjects,
    deleteProject
}
