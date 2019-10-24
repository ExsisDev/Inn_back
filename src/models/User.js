const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const jwt = require('jsonwebtoken');
const config = require('config');


const User = sequelize.define('users', {
   id_user: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
   },
   name: {
      type: Sequelize.STRING,
      allowNull: false
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
   }
}, {
   timestamps: false
});


/**
 * Método de instancia que genera un token conteniendo:
 * 1. El id del usuario instancia.
 * 
 * @return {string} token
 */
User.prototype.generateAuthToken = function () {
   return jwt.sign({ id_user: this.id_user }, config.get('jwtPrivateKey'), { algorithm: 'HS384' });
}


module.exports = User;