const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const jwt = require('jsonwebtoken');
const config = require('config');

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


/**
 * Método de instancia de Ally.
 * Generar un token con:
 * 1. id del aliado instancia.
 * 
 * @return {string} token
 */
Ally.prototype.generateAuthToken = function () {
   return jwt.sign({ id_ally: this.id_ally }, config.get('jwtPrivateKey'), { algorithm: 'HS384' });
}


module.exports = Ally;