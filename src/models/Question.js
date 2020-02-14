var Sequelize = require('sequelize');
var sequelize = require('../utils/database');
var AnswerOption = require('./AnswerOption');

var Question = sequelize.define('questions', {
  id_question: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fk_id_answer_option:{
    type: Sequelize.INTEGER,
    allowNull: false
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

AnswerOption.hasMany(Question, {
  foreignKey: 'fk_id_answer_option',
  sourceKey: 'id_answer_option'
});
Question.belongsTo(AnswerOption, {
  foreignKey: 'fk_id_answer_option',
  targetKey: 'id_answer_option'
}); 

module.exports = Question;