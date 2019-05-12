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
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(params.password, salt, function(err, hash) {
                        user.password = hash;

                        user.save((err, storedUser) => {
                            if (err) return res.status(500).send({ message: 'Error in save request' });

                            if (!storedUser) {
                                return res.status(500).send({ message: 'User could not be stored' });
                            } else {
                                return res.status(200).send({ user: storedUser });
                            }
                        })
                    });
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
                    foundUser.password = undefined;
                    return res.status(500).send({ foundUser, token: jwt.createToken(foundUser) });
                }
            });
        }
    });
}

function editUser(req, res){
    var userId = req.params.id;
    var params = req.body;
    
    if(req.user.sub != userId){
        return res.status(500).send({message: 'No se puede editar al usuario'})
    }    
    delete params.password;

    User.findByIdAndUpdate(userId, params, {new:true}, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'})

        if(!usuarioActualizado) return res.status(404).send({message: 'No se ha podido actualziar los datos del usuario'})
        
        return res.status(200).send({user: usuarioActualizado})
    })
}

function deleteUser(req, res){
    var userId = req.params.id;
 
    if(req.user.sub != userId){
        return res.status(500).send({message: 'No se puede eliminar al usuario'})
    } 

    User.findByIdAndRemove(userId, (err, usuarioEliminado) => {

        if(err) return res.status(500).send({ message: 'Error en el servidor' });
         
            if(usuarioEliminado){
                return res.status(200).send({
                    user: usuarioEliminado
                });
            }else{
                return res.status(404).send({
                    message: 'No existe el usuario'
                });
            }
         
    });

}


module.exports = {
    signUp,
    login,
    editUser,
    deleteUser
}