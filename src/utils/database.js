const Sequalize = require('sequelize');
const fs = require('file-system');
var path = require('path');

/**
 * Constructor de sequelize con la configuración de la base de datos
 * @constructor
 */

// const sequelize = new Sequelize('postgres://user:AdminDB@innovalab-prod-db:5432/Innovalab-dev', 'DATAbase@1',{})

const sequelize = new Sequalize('Innovalab-dev', 'AdminDB@innovalab-prod-db', 'DATAbase@1', {
   host: 'innovalab-prod-db.postgres.database.azure.com',
   port: 5432,
   dialect: 'postgres',
   ssl: {
      ca: fs.readFileSync(path.join(__dirname, './BaltimoreCyberTrustRoot.crt.pem'))
   }, 
   pool: {
      max: 5,
      min: 0,
      require: 30000,
      idle: 10000
   },
   native: false,
   dialectOptions: {
      encrypt: true
   },
   logging: true,
   freezeTableName: true
});

sequelize.sync().then(function(){
   console.log('DB connection sucessful.');
 }, function(err){
   // catch error here
   console.log(err);
 
 });

module.exports = sequelize;