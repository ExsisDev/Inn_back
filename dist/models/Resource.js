"use strict";

var Sequelize = require('sequelize');

var db_con = require('../utils/database');

var Resource = db_con.define('resources', {
  id_resource: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  resource_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  resource_profile: {
    type: Sequelize.STRING,
    allowNull: false
  },
  resource_experience: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  fk_id_ally: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
module.exports = Resource;