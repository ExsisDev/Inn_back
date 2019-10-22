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

User.generateAuthToken = function () {
   return jwt.sign({ _id: this.id }, config.get('jwtPrivateKey'));
};

module.exports = User;