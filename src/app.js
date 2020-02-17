const express = require('express');
const morgan = require('morgan'); //Imprimir las peticiones
const config = require('config');
const debug = require('debug')('app:startup'); //export DEBUG=app:startup
const cors = require('cors');

const allyRoutes = require('./routes/Ally.routes');
const userRoutes = require('./routes/User.routes');
const challengeRoutes = require('./routes/Challenge.routes');
const companyRoutes = require('./routes/Company.routes');
const alCategoriesRoutes = require('./routes/AlCategory.routes');
const resourcesRoutes = require('./routes/Resources.routes');
const proposalRoutes = require('./routes/Proposal.routes');
const noteRoutes = require('./routes/Note.routes');
const surveyRoutes = require('./routes/Survey.routes');

/**
 * Inicialización de express
 */
const app = express();
debug(`NODE_ENV: ${process.env.NODE_ENV}`); //export NODE_ENV=production
debug(`app environment: ${app.get('env')}`);


/**
 * Middlewares
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //POST http://localhost:3000/api/courses (key=value&key=value)
app.use(express.static('public')); //Archivos públicos
if (app.get('env') === 'development') {
   debug(`db host: ${config.get('db_dev.host')}`);
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
app.use('/api/al_categories', alCategoriesRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/surveys', surveyRoutes);


module.exports = app;