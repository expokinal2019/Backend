'use strict'

var Task = require('../models/task');
var Project = require('../models/project');

function addTask(req, res) {
    var idUser=req.user.sub
    var idProject=req.params.idProject
    var params = req.body;
    var task = new Task();

    if (params.name && params.description && params.deadline) {
        task.name = params.name;
        task.description = params.description;
        task.deadline = params.deadline;
        task.taskOwner = idUser;
        task.project=idProject
        task.status = 'TO DO';
        Project.findById(idProject,(err,projectF)=>{
            if (projectF) {
                if (projectF.projectOwner==idUser) {
                    task.save((err, storedTask) => {
                        if (err) return res.status(500).send({ message: 'Error at saving task' });  
                        if (!storedTask) {
                            return res.status(500).send({ message: 'Task could not be saved' });
                        } else {
                            return res.status(200).send({ task: storedTask });
                        }
                    })
                } else {
                    return res.status(500).send({message:'You are not the project Owner'})
                }

            } else {
                 return res.status(500).send({message:'Project doesnt exists'})
            }
        })
    }
}

function getTask(req, res){
    let idUser = req.params.id;

    Task.find({taskOwner : idUser}).exec((err, userTasks) => {
        if (err) return res.status(500).send({ message: 'Request error!' });
        if (!userTasks) {
            return res.status(500).send({ message: 'No found tasks' });
        } else {
            return res.status(200).send({ tasks: userTasks });
        }
    })
}

function getAllTasks(req,res) {
    var idUser=req.user.sub
    var idProject=req.params.idProject;
    Task.find({project:idProject, taskOwner:idUser}).exec((err,tasksByProject)=>{
        if (err) return res.status(500).send({ message: 'Request error!' });
        if (!tasksByProject) {
            return res.status(500).send({ message: 'No found tasks' });
        } else {
            return res.status(200).send({ tasks: tasksByProject });
        }
    })
}
function editTask(req, res){
    let idTask = req.params.id;
    let params = req.body;

    Task.findByIdAndUpdate(idTask, params, {new : true}, (err, editedTask) => {
        if (err) return res.status(500).send({ message: 'Failed to edit the task' });

        if (!editedTask) {
            return res.status(500).send({ message: 'Task could not be edited' });
        } else {
            return res.status(200).send({ task: editedTask });
        }
    })    
}

function deleteTask(req, res){
    let idTask = req.params.id;

    Task.findByIdAndDelete(idTask, (err, deletedTask) => {
        if (err) return res.status(500).send({ message: 'Failed to delete the task' });

        if (!deletedTask) {
            return res.status(500).send({ message: 'Task could not be deleted' });
        } else {
            return res.status(200).send({ task: deletedTask });
        }
    })
}

module.exports = {
    addTask,
    getTask,
    getAllTasks,
    editTask,
    deleteTask
}