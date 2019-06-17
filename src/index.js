'use strict'

const mongoose = require('mongoose');
const app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/expo', {useNewUrlParser: true}).then(() => {
    console.log('You are connected to the database');

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), () => {
        console.log(`Server is running on port ${app.get('port')}`);
        
    });
}).catch(err => console.log(err));