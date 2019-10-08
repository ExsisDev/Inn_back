const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Artist_Category = require('./Artist_Category');

const Category = sequelize.define('categories', {
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
      type: Sequelize.STRING,
   }
}, {
   timestamps: false
});

Category.hasMany(Artist_Category, {foreignKey: 'fk_id_artist', sourceKey: 'id_category'});
Artist_Category.belongsTo(Artist, {foreignKey: 'fk_id_artist', sourceKey: 'id_category'})

module.exports = Category;