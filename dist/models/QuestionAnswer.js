"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Question = require('./Question');

var Answer_Option = require('./AnswerOption');

var Question_Answer = sequelize.define('question_answer', {
  fk_id_question: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_answer_option: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
}); 


module.exports = SurveyQuestion;