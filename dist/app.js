"use strict";

var express = require('express');

var morgan = require('morgan'); //Imprimir las peticiones


var config = require('config');

var debug = require('debug')('app:startup'); //export DEBUG=app:startup


var cors = require('cors');

var allyRoutes = require('./routes/Ally.routes');

var userRoutes = require('./routes/User.routes');

var challengeRoutes = require('./routes/Challenge.routes');

var companyRoutes = require('./routes/Company.routes');

var alCategoriesRoutes = require('./routes/AlCategory.routes');

var surveyRoutes = require('./routes/Survey.routes');

console.log('Application Name: ' + config.get('name'));
/**
 * Inicialización de express
 */

var app = express();
debug("NODE_ENV: ".concat(process.env.NODE_ENV)); //export NODE_ENV=production

debug("app environment: ".concat(app.get('env')));
/**
 * Middlewares
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); //POST http://localhost:3000/api/courses (key=value&key=value)

app.use(express["static"]('public')); //Archivos públicos

if (app.get('env') === 'development') {
  debug("db host: ".concat(config.get('db_dev.host')));
  app.use(morgan('dev'));
  debug('Morgan is enabled...');
}
/**
 * Rutas
 */


app.use('/api/allies', allyRoutes);
app.use('/api/login', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/al_categories', alCategoriesRoutes); // app.use('/api/surveys', surveyRoutes);

module.exports = app;