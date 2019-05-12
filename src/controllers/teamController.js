'use strict'

var Team = require('../models/team');

function createTeam(req, res) {
    var params = req.body;
    var team = new Team();
    var ManagerId = req.user.sub;

    if (params.name) {
        team.name = params.name;
        team.teamManager = ManagerId;

        Team.find({
            $and: [
                { 'name': params.name },
                { 'teamManager': params.teamManager }
            ]
        }).exec((err, teams) => {
            if (err) return res.status(500).send({ message: 'Error at searching teams' });

            if (teams.length > 0) {
                return res.status(500).send({ message: 'You already have a team with that name' });
            } else {
                team.save((err, storedTeam) => {
                    if (err) return res.status(500).send({ message: 'Error at saving team' });

                    if (!storedTeam) {
                        return res.status(500).send({ message: 'Team could not be saved' });
                    } else {
                        return res.status(200).send({ team: storedTeam });
                    }
                });
            }
        });
    } else {
        return res.status(500).send({ message: 'You should add a name to the team' });
    }
}

function deleteTeam(req, res) {
    var teamId = req.params.teamId;
    var ManagerId = req.user.sub;

    Team.findById(teamId).exec((err, foundTeam) => {
        if (err) return res.status(500).send({ message: 'Error at searching teams' });

        if (!foundTeam) {
            return res.status(500).send({ message: 'Team not found' });
        } else {
            if (foundTeam.teamManager == ManagerId) {
                Team.findByIdAndRemove(teamId, (err, updatedTeam) => {
                    if (err) return res.status(500).send({ message: 'Error at deleting team' });

                    if (!updatedTeam) {
                        return res.status(500).send({ message: 'Team could not be deleted' });
                    } else {
                        return res.status(200).send({ team: updatedTeam });
                    }
                })
            }
        }
    });
}

function addIntegrant(req, res) {
    var teamId = req.params.teamId;
    var ManagerId = req.user.sub;
    var integranId = req.params.integrantId;

    Team.findById(teamId).exec((err, foundTeam) => {
        if (err) return res.status(500).send({ message: 'Error at searching teams' });
        console.log(err)
        console.log(foundTeam)
        if (!foundTeam) {
            return res.status(500).send({ message: 'Team not found' });
        } else {
            if (foundTeam.teamManager == ManagerId) {
                console.log(ManagerId, foundTeam.teamManager)
                Team.findByIdAndUpdate(teamId, {
                    $addToSet: {
                        integrants: { 'user': integranId, 'role': 'USER' }
                    }
                }, { new: true }, (err, updatedTeam) => {
                    console.log(err, updatedTeam)
                    if (err) return res.status(500).send({ message: 'Error at adding integrant' });

                    if (!updatedTeam) {
                        return res.status(500).send({ message: 'Integrant could not be added' });
                    } else {
                        return res.status(200).send({ team: updatedTeam });
                    }
                })
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
                    $pull: { integrants: { 'user': integranId } }
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



module.exports = {
    createTeam,
    addIntegrant,
    removeIntegrant,
    deleteTeam
}