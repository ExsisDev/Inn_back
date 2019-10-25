"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var jwt = require('jsonwebtoken');

var config = require('config');

var User = sequelize.define('users', {
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
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
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
  return jwt.sign({
    id_user: this.id_user,
    is_admin: this.is_admin
  }, config.get('jwtPrivateKey'), {
    algorithm: 'HS384'
  });
};

module.exports = User;