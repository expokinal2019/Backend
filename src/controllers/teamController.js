'use strict'

var Team = require('../models/team');

function createTeam(req, res) {
    var params = req.body;
    var team = new Team();

    if (params.name) {

        Team.find({
            $and: [
                { 'name': params.name }
            ]
        }).exec((err, teams) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (teams.length > 0) {
                return res.status(404).send({ message: 'Ya tiene un equipo con este nombre' });
            } else {
                team.name = params.name
                team.description = params.description;
                team.integrants = [];
                team.save((err, storedTeam) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' });

                    if (!storedTeam) {
                        return res.status(404).send({ message: 'El equipo no ha sido guardado' });
                    } else {
                        return res.status(200).send({ team: storedTeam });
                    }
                });
            }
        });
    } else {
        return res.status(404).send({ message: 'El equipo debe tener nombre' });
    }
}

function getTeam(req, res) {
    let id = req.params.id;

    Team.findById(id, (err, teams) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!teams) return res.status(404).send({ message: 'No se ha podido obtener el equipo' })

        return res.status(200).send({ teams: teams })
    })

}

function editTeam(req, res) {
    let idTeam = req.params.id;
    let params = req.body;

    Team.findByIdAndUpdate(idTeam, params, { new: true }, (err, editedTeam) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!editedTeam) {
            return res.status(500).send({ message: 'El equipo no pudo ser editado' });
        } else {
            return res.status(200).send({ team: editedTeam });
        }
    });
}

function deleteTeam(req, res) {
    var teamId = req.params.teamId;
    Team.findByIdAndRemove(teamId, (err, updatedTeam) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!updatedTeam) {
            return res.status(500).send({ message: 'El equipo no pudo ser eliminado' });
        } else {
            return res.status(200).send({ team: updatedTeam });
        }
    });
}

function addIntegrant(req, res) {
    var teamId = req.params.teamId;
    var integrantId = req.params.integrantId;
    var estado = true;

    Team.findById(teamId).exec((err, foundTeam) => {
        if (err) return res.status(500).send({ message: 'Error at searching teams' });
        if (!foundTeam) {
            return res.status(500).send({ message: 'Team not found' });
        } else {
            if (true) {
                foundTeam.integrants.forEach(element => {
                    if (element._id === integrantId) {
                        estado = false;
                        return res.status(500).send({ message: 'El usuario ya es integrante de este equipo.' })
                    }
                });
                if (estado) {
                    Team.findByIdAndUpdate(teamId, {
                        $addToSet: {
                            integrants: { 'user': integrantId, 'role': 'USER' }
                        }
                    }, { new: true }, (err, updatedTeam) => {
                        if (err) return res.status(500).send({ message: 'Error at adding integrant' });

                        if (!updatedTeam) {
                            return res.status(500).send({ message: 'Integrant could not be added' });
                        } else {
                            return res.status(200).send({ team: updatedTeam });
                        }
                    });
                }
            }
        }
    })
}

function removeIntegrant(req, res) {
    var teamId = req.params.teamId;
    var ManagerId = req.user.sub;
    var integranId = req.params.integrantId;

    Team.findById(teamId).exec((err, foundTeam) => {
        if (err) return res.status(500).send({ message: 'Error at searching teams' });

        if (!foundTeam) {
            return res.status(500).send({ message: 'Team not found' });
        } else {
            if (foundTeam.teamManager == ManagerId) {
                Team.findByIdAndUpdate(teamId, {
                    $pull: { integrants: { '_id': integranId } }
                }, { new: true }, (err, updatedTeam) => {
                    if (err) return res.status(500).send({ message: 'Error at removing integrant' });

                    if (!updatedTeam) {
                        return res.status(500).send({ message: 'Integrant could not be removed' });
                    } else {
                        return res.status(200).send({ team: updatedTeam });
                    }
                })
            }
        }
    });
}

function listTeams(req, res) {
    Team.find({}).exec((err, userTeams) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!userTeams) return res.status(404).send({ message: 'No se han obtenido los equipos' })
        return res.status(200).send({ teams: userTeams });
    })
}

function userTeams(req, res) {
    var userId = req.user.sub;
    Team.find({ integrants: { $elemMatch: {user: userId}}}, (err, teams)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})

        if(!teams) return res.status(404).send({message: 'No se han podido obtener los equipos con el usuario'})

        return res.status(200).send({teams: teams});

    })
}

module.exports = {
    createTeam,
    addIntegrant,
    editTeam,
    removeIntegrant,
    deleteTeam,
    listTeams,
    getTeam,
    userTeams
}