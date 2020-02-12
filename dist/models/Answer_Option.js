"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Question_Answer = require('./Question_Answer');

var Answer_Option = sequelize.define('answer_option', {
  id_answer_option: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  answer_option: {
    type: Sequelize.ARRAY,
    allowNull: false
  },
  answer_option_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
}); 

Answer_Option.hasMany(Question_Answer, {
  foreignKey: 'fk_id_answer_option',
  sourceKey: 'id_answer_option'
});
Question_Answer.belongsTo(Answer_Option, {
  foreignKey: 'fk_id_answer_option',
  targetKey: 'id_answer_option'
});

module.exports = Question;