var Sequelize = require('sequelize');
var sequelize = require('../utils/database');

var AnswerOption = sequelize.define('answer_options', {
  id_answer_option: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  answer_option: {
    type: Sequelize.ARRAY(Sequelize.STRING),
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

module.exports = AnswerOption;