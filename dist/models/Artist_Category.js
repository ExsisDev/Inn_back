"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Artist_Category = sequelize.define('artists_categories', {
  id_artists_categories: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fk_id_artist: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_category: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  details: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});
module.exports = Artist_Category;