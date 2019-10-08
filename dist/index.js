"use strict";

var express = require('express');

var morgan = require('morgan'); //Imprimir las peticiones


var config = require('config');

var debug = require('debug')('app:startup'); //export DEBUG=app:startup


var _require = require('./middleware/logger'),
    logging = _require.logging,
    authenticating = _require.authenticating;

var courses = require('./routes/courses');

var home = require('./routes/home'); //Configuration


console.log('Application Name: ' + config.get('name')); //Express

var app = express();
debug("NODE_ENV: ".concat(process.env.NODE_ENV)); //export NODE_ENV=production

debug("app: ".concat(app.get('env')));
debug("password: ".concat(config.get('mail.password')));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); //POST http://localhost:3000/api/courses (key=value&key=value)

app.use(express["static"]('public')); //Archivos públicos

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan is enabled...');
} //Middlewares


app.use(logging);
app.use(authenticating);
app.use(morgan('tiny'));
app.use('/api/courses', courses);
app.use('/', home); // PORT 

var port = process.env.PORT || 3000;
app.listen(port, function () {
  return console.log("Listening on port ".concat(port, " ..."));
});