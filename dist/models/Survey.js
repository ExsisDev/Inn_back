"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var SurveyQuestion = require('./SurveyQuestion');

var Challenge = require('./Challenge');

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
  user_id_creator: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
}); // Survey.hasMany(SurveyQuestion, { foreignKey: 'fk_id_survey', sourceKey: 'id_survey' });
// Survey.hasMany(Challenge, { foreignKey: 'fk_id_survey', sourceKey: 'id_survey' });

module.exports = Survey;