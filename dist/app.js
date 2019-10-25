"use strict";

var express = require('express');

var morgan = require('morgan'); //Imprimir las peticiones


var config = require('config');

var debug = require('debug')('app:startup'); //export DEBUG=app:startup


var _require = require('./middleware/logger'),
    logging = _require.logging,
    authenticating = _require.authenticating;

var artist = require('./routes/artist.route');

var category = require('./routes/category.route');

var user = require('./routes/user.route');

console.log('Application Name: ' + config.get('name'));
/**
 * Inicialización de express
 */

var app = express();
debug("NODE_ENV: ".concat(process.env.NODE_ENV)); //export NODE_ENV=production

debug("app: ".concat(app.get('env')));
debug("password: ".concat(config.get('mail.password')));
/**
 * Middlewares
 */

app.use(logging);
app.use(authenticating);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); //POST http://localhost:3000/api/courses (key=value&key=value)

app.use(express["static"]('public')); //Archivos públicos

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  debug('Morgan is enabled...');
}
/**
 * Rutas
 */


app.use('/api/artists', artist);
app.use('/api/categories', category);
app.use('/api/users', user);
module.exports = app;