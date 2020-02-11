const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Challenge = require('./Challenge');

const Note = sequelize.define('notes', {
   id_note: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
   },
   fk_id_challenge: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   note_header: {
      type: Sequelize.TEXT,
      allowNull: false
   },
   note_content: {
      type: Sequelize.TEXT,
      allowNull: false
   }
},{
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});

Challenge.hasMany(Note, { foreignKey: 'fk_id_challenge', sourceKey: 'id_challenge' });
Note.belongsTo(Challenge, { foreignKey: 'fk_id_challenge', targetKey: 'id_challenge' });


module.exports = Note;