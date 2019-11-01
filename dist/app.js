"use strict";

var express = require('express');

var morgan = require('morgan'); //Imprimir las peticiones


var config = require('config');

var debug = require('debug')('app:startup'); //export DEBUG=app:startup


var _require = require('./middleware/logger'),
    logging = _require.logging,
    authenticating = _require.authenticating;

var artistRoutes = require('./routes/artist.route');

var categoryRoutes = require('./routes/category.route');

var userRoutes = require('./routes/user.route');

var surveyRoutes = require('./routes/survey.route');

console.log('Application Name: ' + config.get('name'));
/**
 * Inicialización de express
 */

var app = express();
debug("NODE_ENV: ".concat(process.env.NODE_ENV)); //export NODE_ENV=production

debug("app environment: ".concat(app.get('env')));
debug("mailer password: ".concat(config.get('mail.password')));
debug("db host: ".concat(config.get('db.host')));
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


app.use('/api/artists', artistRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
module.exports = app;