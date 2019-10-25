"use strict";

var Sequalize = require('sequelize');

var config = require('config');
/**
 * Constructor de sequelize con la configuración de la base de datos
 * @constructor
 */


var sequelize = new Sequalize('TTDB', 'postgres', "".concat(config.get('db.password')), {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    require: 30000,
    idle: 10000
  },
  logging: true,
  freezeTableName: true
});
module.exports = sequelize;