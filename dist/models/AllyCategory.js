"use strict";

var Sequelize = require('sequelize');

var db_cnx = require('../utils/database');

var AlCategory = require('./AlCategory');

var Ally = require('./Ally');

var AllyCategory = db_cnx.define('ally_categories', {
  fk_id_ally: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  fk_id_category: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
AlCategory.hasMany(AllyCategory, {
  foreignKey: 'fk_id_category',
  sourceKey: 'id_category'
});
AllyCategory.belongsTo(AlCategory, {
  foreignKey: 'fk_id_category',
  targetKey: 'id_category'
});
Ally.hasMany(AllyCategory, {
  foreignKey: 'fk_id_ally',
  sourceKey: 'id_ally'
});
AllyCategory.belongsTo(Ally, {
  foreignKey: 'fk_id_ally',
  targetKey: 'id_ally'
});
module.exports = AllyCategory;