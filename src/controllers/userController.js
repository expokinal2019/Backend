'use strict'

var bcrypt = require('bcryptjs');
var jwt = require('../services/jwt');
var User = require('../models/user');

function signUp(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.username && params.email && params.password) {
        user.name = params.name;
        user.username = params.username;
        user.email = params.email;
        user.password = params.password;
        user.image = null;

        User.find({
            $or: [
                { 'username': user.username.toLowerCase() },
                { 'email': user.email.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error in search request' });

            if (user && users.length > 0) {
                return res.status(500).send({ message: 'The username or email is already resgister with other user' });
            } else {
                bcrypt.hash(params.password, (err, hash) => {
                    user.password = hash;

                    user.save((err, storedUser) => {
                        if (err) return res.status(500).send({ message: 'Error in save request' });

                        if (!storedUser) {
                            return res.status(500).send({ message: 'User could not be stored' });
                        } else {
                            return res.status(200).send({ user: storedUser });
                        }
                    })
                })
            }
        })
    } else {
        return res.status(500).send({ message: 'You must fill all fields before saving' });
    }
}

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ 'email': email }, (err, foundUser) => {
        if (err) return res.status(500).send({ message: 'Error in request' });

        if (!foundUser) {
            return res.status(500).send({ message: 'User not found' });
        } else {
            bcrypt.compare(password, foundUser.password, (err, check) => {
                if (!check) {
                    return res.status(500).send({ message: 'Wrong password' });
                } else {
                    if (!params.getToken) {
                        foundUser.password = undefined;
                        return res.status(500).send({ foundUser });
                    } else {
                        return res.status(500).send({ token: jwt.createToken(foundUser) });
                    }
                }
            });
        }
    });
}

module.exports = {
    signUp,
    login
}