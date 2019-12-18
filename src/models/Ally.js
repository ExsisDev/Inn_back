const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./User');

const Ally = sequelize.define('allies', {
   id_ally: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
   },
   fk_id_user: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
   },
   ally_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
   },
   ally_nit: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: true
   },
   ally_web_page: {
      type: Sequelize.STRING,
      allowNull: false
   },
   ally_phone: {
      type: Sequelize.STRING,
      allowNull: false
   },
   ally_month_ideation_hours: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   ally_month_experimentation_hours: {
      type: Sequelize.INTEGER,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});

User.hasOne(Ally, { foreignKey: 'fk_id_user', sourceKey: 'id_user' });
Ally.belongsTo(User, { foreignKey: 'fk_id_user', targetKey: 'id_user' });

module.exports = Ally;