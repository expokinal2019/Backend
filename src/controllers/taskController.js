"use strict";

var Task = require("../models/task");
var Project = require("../models/project");
var Team = require("../models/team");

function addTask(req, res) {
  var idUser = req.user.sub;
  var idProject = req.params.idProject;
  var params = req.body;
  var task = new Task();

  if (params.name && params.description && params.deadline) {
    task.name = params.name;
    task.description = params.description;
    task.deadline = params.deadline;
    task.taskOwner = idUser;
    task.project = idProject;
    task.status = "TO DO";
    Project.findById(idProject, (err, projectF) => {
      if (projectF) {
        if (projectF.projectOwner == idUser) {
          task.save((err, storedTask) => {
            if (err)
              return res.status(500).send({ message: "Error al guardar la tarea" });
            if (!storedTask) {
              return res
                .status(500)
                .send({ message: "La tarea no se pudo guardar" });
            } else {
              return res.status(200).send({ task: storedTask });
            }
          });
        } else {
          return res
            .status(500)
            .send({ message: "Usted no es el propietario del proyecto" });
        }
      } else {
        return res.status(500).send({ message: "El Proyecto no existe" });
      }
    });
  } else {
    return res.status(400).send({ message: "Solicitud incorrecta" });
  }
}

function getTask(req, res) {
  let taskId = req.params.id;

  Task.find({ _id: taskId }).exec((err, userTasks) => {
    if (err) return res.status(500).send({ message: "Solicitud incorrecta!" });
    if (!userTasks) {
      return res.status(404).send({ message: "No se encontraron tareas" });
    } else {
      return res.status(200).send({ tasks: userTasks });
    }
  });
}

function getTasksByOwner(req, res) {
  let ownerId = req.params.id;

  Task.find({ taskOwner: ownerId }).exec((err, userTasks) => {
    if (err) return res.status(500).send({ message: "Error en peticion!" });
    if (!userTasks) {
      return res.status(404).send({ message: "No se encontraron tareas" });
    } else {
      return res.status(200).send({ tasks: userTasks });
    }
  });
}

function getAllTasks(req, res) {
  var idUser = req.user.sub;
  var idProject = req.params.idProject;
  Task.find({ project: idProject, taskOwner: idUser }).exec(
    (err, tasksByProject) => {
      if (err) return res.status(500).send({ message: "Error en peticion!" });
      if (!tasksByProject) {
        return res.status(404).send({ message: "No se encontraron tareas" });
      } else {
        return res.status(200).send({ tasks: tasksByProject });
      }
    }
  );
}

function getTasksByDate(req, res) {
  let idUser = req.user.sub;
  let date = req.params.date;
  let projectId = req.body.project;

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Error en peticion!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId, deadline: date }).exec(
          (err, tasksByDate) => {
            if (err) return res.status(500).send({ message: "Error en peticion!" });
            if (!tasksByDate) {
              return res.status(404).send({ message: "No se encontraron tareas" });
            } else {
              return res.status(200).send({ tasks: tasksByDate });
            }
          }
        );
      } else {
        console.log("El usuario no forma parte del proyecto.");
      }
    });
  });
}

function getTasksByStatus(req, res) {
  let idUser = req.user.sub;
  let status = req.params.status;
  let projectId = req.body.project;

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Error en peticion!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId, status: status }).exec(
          (err, tasksByStatus) => {
            if (err) return res.status(500).send({ message: "Error en peticion!" });
            if (!tasksByStatus) {
              return res.status(404).send({ message: "No se encontraron tareas" });
            } else {
              return res.status(200).send({ tasks: tasksByStatus });
            }
          }
        );
      } else {
        console.log("El usuario no forma parte del proyecto.");
      }
    });
  });
}

function getTasksByLabels(req, res) {
  let idUser = req.user.sub;
  let labels = req.params.labels;
  let projectId = req.body.project;

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Error en peticion!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId, labels: labels }).exec(
          (err, tasksByLabel) => {
            if (err) return res.status(500).send({ message: "Error en peticion!" });
            if (!tasksByLabel) {
              return res.status(404).send({ message: "No se encontraron tareas" });
            } else {
              return res.status(200).send({ tasks: tasksByLabel });
            }
          }
        );
      } else {
        console.log("El usuario no forma parte del proyecto.");
      }
    });
  });
}

function getPendingTasks(req, res) {
  let idUser = req.user.sub;
  let projectId = req.params.projectId;

  var pendingTasks = [];

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Error en peticion!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId }).exec((err, pendingTask) => {
          if (err) return res.status(500).send({ message: "Error en peticion!" });
          if (!pendingTask) {
            return res.status(404).send({ message: "No se encontraron tareas" });
          } else {
            for (let i = 0; i < pendingTask.length; i++) {
              if (pendingTask[i].progress < 100) {
                pendingTasks.push(pendingTask[i]);
              }
            }
            return res.status(200).send({ tasks: pendingTasks });
          }
        });
      } else {
        console.log("El usuario no forma parte del proyecto.");
      }
    });
  });
}

function editTask(req, res) {
  let idTask = req.params.id;
  let params = req.body;

  Task.findByIdAndUpdate(idTask, params, { new: true }, (err, editedTask) => {
    if (err)
      return res.status(500).send({ message: "Error al editar la tarea" });

    if (!editedTask) {
      return res.status(404).send({ message: "La tarea no se pudo editar" });
    } else {
      return res.status(200).send({ task: editedTask });
    }
  });
}

function deleteTask(req, res) {
  let idTask = req.params.id;

  Task.findByIdAndDelete(idTask, (err, deletedTask) => {
    if (err)
      return res.status(500).send({ message: "Error al eliminar la tarea" });

    if (!deletedTask) {
      return res.status(500).send({ message: "La tarea no se pudo eliminar" });
    } else {
      return res.status(200).send({ task: deletedTask });
    }
  });
}

module.exports = {
  addTask,
  getTask,
  getAllTasks,
  editTask,
  deleteTask,
  getTasksByOwner,
  getTasksByDate,
  getTasksByStatus,
  getTasksByLabels,
  getPendingTasks
};
