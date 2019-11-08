const Sequelize = require('sequelize');
const config = require('config');

/**
 * Constructor de sequelize con la configuración de la base de datos
 * @constructor
 */

// const sequelize = new Sequelize('postgres://user:AdminDB@innovalab-prod-db:5432/Innovalab-dev', 'DATAbase@1',{})

const sequelize = new Sequelize('Innovalab-dev', 'AdminDB@innovalab-dev-db', 'DATAbase@1', {
   host: 'innovalab-prod-db.postgres.database.azure.com',
   port: 5432,
   dialect: 'postgres',
   pool: {
      max: 5,
      min: 0,
      require: 30000,
      idle: 10000
   },
   dialectOptions: {
      ssl: true
   },
   logging: true,
   freezeTableName: true
});


/**
 * Test database connection
 */
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


/**
 * Run migrations
 */
if (process.env.NODE_ENV === 'production') {
   sequelize.sync().then((result) => {
      console.log('DB connection sucessful.');
   }).catch((error) => {
      // catch error here
      console.log(error);
   });
}
 

module.exports = sequelize;