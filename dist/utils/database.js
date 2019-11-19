"use strict";

var Sequelize = require('sequelize');

var config = require('config');
/**
 * Constructor de sequelize con la configuración de la base de datos
 * @constructor
 */


var loggingEnv;
var envLoad;

if (process.env.NODE_ENV === 'production') {
  envLoad = 'prod';
  loggingEnv = false;
} else {
  envLoad = 'dev';
  loggingEnv = true;
}

var sequelize = new Sequelize(config.get("db_".concat(envLoad, ".name")), config.get("db_".concat(envLoad, ".user")), config.get('db.password'), {
  host: config.get("db_".concat(envLoad, ".host")),
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    require: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: true
  },
  logging: loggingEnv,
  freezeTableName: true
});
/**
 * Test database connection
 */

sequelize.authenticate().then(function (err) {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.log('Unable to connect to the database:', err);
});
/**
 * Run migrations
 */

if (process.env.NODE_ENV === 'production') {
  sequelize.sync().then(function (result) {
    console.log('DB connection sucessful.');
  })["catch"](function (error) {
    // catch error here
    console.log(error);
  });
}

module.exports = sequelize;