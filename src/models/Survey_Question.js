const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Question = require('./Question');
const Survey = require('./Survey');

const SurveyQuestion = sequelize.define('survey_questions', {
   fk_id_survey: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   fk_id_question: {
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


SurveyQuestion.belongsTo(Question, { foreignKey: 'fk_id_question', targetKey: 'id_question' });
SurveyQuestion.belongsTo(Survey, { foreignKey: 'fk_id_survey', targetKey: 'id_survey' });


module.exports = SurveyQuestion;