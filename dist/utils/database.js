"use strict";

var Sequalize = require('sequelize');

var fs = require('file-system');

var path = require('path');
/**
 * Constructor de sequelize con la configuración de la base de datos
 * @constructor
 */
// const sequelize = new Sequelize('postgres://user:AdminDB@innovalab-prod-db:5432/Innovalab-dev', 'DATAbase@1',{})


var sequelize = new Sequalize('Innovalab-dev', 'AdminDB@innovalab-dev-db', 'DATAbase@1', {
  host: 'innovalab-prod-db.postgres.database.azure.com',
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
  logging: true,
  freezeTableName: true
});
sequelize.sync().then(function (result) {
  console.log('DB connection sucessful.');
})["catch"](function (error) {
  // catch error here
  console.log(error);
});
module.exports = sequelize;