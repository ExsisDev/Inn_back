const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Survey = require('./Survey');
const Company = require('./Company');

const Challenge = sequelize.define('challenge', {
   id_challenge: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
   },
   fk_id_survey: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   fk_id_company: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   challenge_name: {
      type: Sequelize.STRING,
      allowNull: false
   },
   challenge_description: {
      type: Sequelize.TEXT,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});


Challenge.belongsTo(Survey, { foreignKey: 'fk_id_survey', targetKey: 'id_survey' });
Challenge.belongsTo(Company, { foreignKey: 'fk_id_company', targetKey: 'id_company' });


module.exports = Challenge;
