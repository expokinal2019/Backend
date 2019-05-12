'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var pass = 'super_ultra_mega_top_secrete_password';

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        usrname: user.username,
        email: user.email,
        image: user.image,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix
    };

    return jwt.encode(payload, pass)
}