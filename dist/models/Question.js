"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var SurveyQuestion = require('./SurveyQuestion');

var Question = sequelize.define('questions', {
  id_question: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question_header: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  question_is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
}); // Question.hasMany(SurveyQuestion, { foreignKey: 'fk_id_question', sourceKey: 'id_question' });

module.exports = Question;