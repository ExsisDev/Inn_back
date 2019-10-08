const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Artist_Category = require('./Artist_Category');

const Artist = sequelize.define('artists', {
   id_artist: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
   },
   full_name: {
      type: Sequelize.STRING,
      allowNull: false
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false
   },
   address: {
      type: Sequelize.STRING,
      allowNull: false
   },
   phone_number: {
      type: Sequelize.NUMBER,
      allowNull: false
   },
   start_date: {
      type: Sequelize.DATE,
      allowNull: false
   },
   birth_date: {
      type: Sequelize.DATE,
      allowNull: false
   }
}, {
   timestamps: false
});

Artist.hasMany(Artist_Category, {foreignKey: 'fk_id_artist', sourceKey: 'id_artist'});
Artist_Category.belongsTo(Artist, {foreignKey: 'fk_id_artist', sourceKey: 'id_artist'})

module.exports = Artist;