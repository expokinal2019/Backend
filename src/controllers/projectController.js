"use strict";

var Project = require("../models/project");
var Task = require("../models/task");

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
      if (err)
        return res.status(500).send({ message: "Error al guardar proyecto" });

      if (!storedProject) {
        return res.status(500).send({ message: "Proyecto no pudo ser guardado" });
      } else {
        return res.status(200).send({ project: storedProject });
      }
    });
  } else {
    return res.status(500).send({
      message: "Rellene todos los campos requeridos antes de crear el proyecto."
    });
  }
}

function editProject(req, res) {
  var params = req.body;
  var projectId = req.params.projectId;

  Project.findByIdAndUpdate(
    projectId,
    params,
    { new: true },
    (err, updatedProject) => {
      if (err)
        return res.status(500).send({ message: "Error en la solicitud de actualización" });

      if (!updatedProject) {
        return res
          .status(500)
          .send({ message: "Proyecto no pudo ser actualizado" });
      } else {
        return res.status(200).send({ project: updatedProject });
      }
    }
  );
}

// @TODO Necesito obtener los proyectos, de los cuales no soy el dueño,
//     pero pertenezco al equipo de trabajo.
function getProjects(req, res) {
  var projectOwner = req.params.id;

  Project.find({ projectOwner: projectOwner }).exec((err, projects) => {
    if (err) return res.status(500).send({ message: "error en la solicitud de búsqueda" });

    if (!projects) {
      return res.status(500).send({ message: "No hay proyectos para listar." });
    } else {
      return res.status(200).send({ projects: projects });
    }
  });
}

function deleteProject(req, res) {
  var projectId = req.params.id;

  Project.findByIdAndDelete(projectId, (err, deletedProject) => {
    Task.find({ project: projectId }, (err, tasksByProject) => {
      tasksByProject.forEach(element => {
        Task.findByIdAndDelete(element.id, (err, taskDeleted) => {
          if (err) return res.status(404).send({ message: "Error en la peticion!" });
          if (!taskDeleted)
            return res
              .status(500)
              .send({ message: "No hay tareas para enumerar." });
        });
      });
    });
    if (err)
      return res.status(500).send({ message: "Error en la solicitud de eliminación" });
    if (!deletedProject) {
      return res.status(500).send({ message: "Proyecto no pudo ser eliminado" });
    } else {
      if (deletedProject.projectOwner == req.user.sub) {
        return res
          .status(200)
          .send({ message: "Proyecto eliminado exitosamente" });
      } else {
        return res
          .status(500)
          .send({ message: "No tienes permiso para borrar el proyecto." });
      }
    }
  });
}

module.exports = {
  addProject,
  editProject,
  getProjects,
  deleteProject
};
