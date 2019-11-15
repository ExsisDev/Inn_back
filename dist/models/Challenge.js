"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Survey = require('./Survey');

var Company = require('./Company');

var Challenge = sequelize.define('challenge', {
  id_challenge: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fk_id_survey: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_company: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  challenge_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  challenge_description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  fk_id_challenge_state: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
Challenge.belongsTo(Survey, {
  foreignKey: 'fk_id_survey',
  targetKey: 'id_survey'
});
Challenge.belongsTo(Company, {
  foreignKey: 'fk_id_company',
  targetKey: 'id_company'
});
module.exports = Challenge;