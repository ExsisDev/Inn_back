const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Company = sequelize.define('companies', {
   id_company: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
   },
   company_name: {
      type: Sequelize.STRING,
      allowNull: false
   },
   company_description: {
      type: Sequelize.TEXT,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});


module.exports = Company;