"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Survey = sequelize.define('surveys', {
  id_survey: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  survey_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});
module.exports = Survey;