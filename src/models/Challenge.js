const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

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


module.exports = Challenge;
