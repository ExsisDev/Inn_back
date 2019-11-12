const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const SurveyQuestion = require('./Survey_Question');
const Challenge = require('./Challenge');


const Survey = sequelize.define('surveys', {
   id_survey: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
   },
   survey_date: {
      type: Sequelize.DATE,
      allowNull: false
   },
   user_id_creator: {
      type: Sequelize.INTEGER,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});


Survey.hasMany(SurveyQuestion, { foreignKey: 'fk_id_survey', sourceKey: 'id_survey' });
Survey.hasMany(Challenge, { foreignKey: 'fk_id_survey', sourceKey: 'id_survey' });


module.exports = Survey;