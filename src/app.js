const express = require('express');
const morgan = require('morgan'); //Imprimir las peticiones
const config = require('config');
const debug = require('debug')('app:startup'); //export DEBUG=app:startup


const allyRoutes = require('./routes/Ally.routes');
const userRoutes = require('./routes/User.routes');


console.log('Application Name: ' + config.get('name'));


/**
 * Inicialización de express
 */
const app = express();
debug(`NODE_ENV: ${process.env.NODE_ENV}`); //export NODE_ENV=production
debug(`app environment: ${app.get('env')}`);
debug(`mailer password: ${config.get('mail.password')}`);
debug(`db host: ${config.get('db.host')}`);


/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //POST http://localhost:3000/api/courses (key=value&key=value)
app.use(express.static('public')); //Archivos públicos
if (app.get('env') === 'development') {
   app.use(morgan('dev'));
   debug('Morgan is enabled...');
}


/**
 * Rutas
 */
app.use('/api/allies', allyRoutes);
app.use('/api/login', userRoutes);


module.exports = app;