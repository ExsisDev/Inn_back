const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const jwt = require('jsonwebtoken');
const config = require('config');
const Ally = require('./Ally');


const User = sequelize.define('users', {
   id_user: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
   },
   fk_id_role: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   fk_user_state: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   user_email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
   },
   user_password: {
      type: Sequelize.STRING,
      allowNull: false
   },
   user_last_login: {
      type: Sequelize.DATE,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});


/**
 * Método de instancia de User que genera un token con:
 * 1. El id del usuario instancia.
 * 2. El rol de usuario
 * 
 * @return {string} token
 */
User.prototype.generateAuthToken = function () {
   return jwt.sign({ id_user: this.id_user, fk_id_role: this.fk_id_role }, config.get('jwtPrivateKey'), { algorithm: 'HS384' });
}


User.hasOne(Ally, {foreignKey: 'fk_id_user', sourceKey: 'id_user'});


module.exports = User;