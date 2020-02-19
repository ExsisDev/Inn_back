"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Question = require('./Question');

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
Question.hasMany(SurveyQuestion, {
  foreignKey: 'fk_id_question',
  sourceKey: 'id_question'
});
SurveyQuestion.belongsTo(Question, {
  foreignKey: 'fk_id_question',
  targetKey: 'id_question'
});
module.exports = SurveyQuestion;