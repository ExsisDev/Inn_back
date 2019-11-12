const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

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


module.exports = SurveyQuestion;