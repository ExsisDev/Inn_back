const Sequelize = require('sequelize');
const config = require('config');

/**
 * Constructor de sequelize con la configuración de la base de datos
 * @constructor
 */

const sequelize = new Sequelize(config.get('db_dev.name'), config.get('db_dev.user'), config.get('db.password'), {
   host: config.get('db_dev.host'),
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
   .then(function (err) {
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