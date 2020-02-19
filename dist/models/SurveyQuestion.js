"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Question = require('./Question');

var Survey = require('./Survey');

var SurveyQuestion = sequelize.define('survey_questions', {
  fk_id_survey: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_question: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  answer: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
}); 


module.exports = SurveyQuestion;