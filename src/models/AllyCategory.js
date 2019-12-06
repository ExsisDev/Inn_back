const Sequelize = require('sequelize');
const db_cnx = require('../utils/database');

const AllyCategory = db_cnx.define('ally_categories', {
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

module.exports = AllyCategory;