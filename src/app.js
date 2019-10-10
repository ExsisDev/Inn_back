const express = require('express');
const morgan = require('morgan'); //Imprimir las peticiones
const config = require('config');
const debug = require('debug')('app:startup'); //export DEBUG=app:startup
const { logging, authenticating } = require('./middleware/logger');

const home = require('./routes/home');
const artist = require('./routes/artist.route');


//Configuration
console.log('Application Name: ' + config.get('name'));


//Express
const app = express();
debug(`NODE_ENV: ${process.env.NODE_ENV}`); //export NODE_ENV=production
debug(`app: ${app.get('env')}`);
debug(`password: ${config.get('mail.password')}`);


//Middleware
app.use(logging);
app.use(authenticating);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //POST http://localhost:3000/api/courses (key=value&key=value)
app.use(express.static('public')); //Archivos públicos
if (app.get('env') === 'development') {
   app.use(morgan('dev'));
   debug('Morgan is enabled...');
}


//Routes
app.use('/', home);
app.use('/api/artists', artist);


module.exports = app;