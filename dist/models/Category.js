"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Artist_Category = require('./Artist_Category');

var Category = sequelize.define('categories', {
  id_category: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  details: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});
Category.hasMany(Artist_Category, {
  foreignKey: 'fk_id_category',
  sourceKey: 'id_category'
});
Artist_Category.belongsTo(Category, {
  foreignKey: 'fk_id_category',
  sourceKey: 'id_category'
});
module.exports = Category;