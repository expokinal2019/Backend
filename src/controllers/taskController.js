'use strict'

var Task = require('../models/task');

function addTask(req, res) {
    var params = req.body;
    var task = new Task();

    if (params.name && params.description && params.deadline && params.taskOwner) {
        task.name = params.name;
        task.description = params.description;
        task.deadline = params.deadline;
        task.taskOwner = params.taskOwner;
        task.status = 'TO DO';

        task.save((err, storedTask) => {
            if (err) return res.status(500).send({ message: 'Error at saving task' });

            if (!storedTask) {
                return res.status(500).send({ message: 'Task could not be saved' });
            } else {
                return res.status(200).send({ task: storedTask });
            }
        })
    }
}

module.exports = {
    addTask
}