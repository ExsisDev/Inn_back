const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Artist_Category = sequelize.define('artists_categories', {
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
      type: Sequelize.STRING,
   }
}, {
   timestamps: false
});

module.exports = Artist_Category;
