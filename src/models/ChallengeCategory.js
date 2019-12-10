const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const ChCategory = require('./ChCategory');


const ChallengeCategory = sequelize.define('challenge_categories', {
	fk_id_challenge: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
   },
   fk_id_category: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});


ChCategory.hasMany(ChallengeCategory, {foreignKey: 'fk_id_category', sourceKey: 'id_category'});
ChallengeCategory.belongsTo(ChCategory, { foreignKey: 'fk_id_category', targetKey: 'id_category' });


module.exports = ChallengeCategory;