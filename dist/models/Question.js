"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var SurveyQuestion = require('./SurveyQuestion');

var Question_Answer = require('./QuestionAnswer');

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
}); 

Question.hasMany(SurveyQuestion, {
  foreignKey: 'fk_id_question',
  sourceKey: 'id_question'
});
SurveyQuestion.belongsTo(Question, {
  foreignKey: 'fk_id_question',
  targetKey: 'id_question'
});


Question.hasMany(Question_Answer, {
  foreignKey: 'fk_id_question',
  sourceKey: 'id_question'
});
Question_Answer.belongsTo(Question, {
  foreignKey: 'fk_id_question',
  targetKey: 'id_question'
});

module.exports = Question;