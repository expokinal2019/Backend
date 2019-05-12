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

function addIntegrant(req, res) {
    var teamId = req.params.teamId;
    var integranId = req.user.sub;
    var ManagerId = req.params.ManagerId;

    Team.findById(teamId).exec((err, foundTeam) => {
        if (err) return res.status(500).send({ message: 'Error at searching teams' });

        if (!foundTeam) {
            return res.status(500).send({ message: 'Team not found' });
        } else {
            if (foundTeam.ManagerId === ManagerId) {
                Team.findByIdAndUpdate(teamId, {
                    $push: {
                        integrants: { 'user': integranId, 'role': 'USER' }
                    }
                }, { new: true }, (err, updatedTeam) => {
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

module.exports = {
    createTeam,
    addIntegrant
}