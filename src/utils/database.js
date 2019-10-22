const Sequalize = require('sequelize');
const config = require('config');


//Constructor de sequalize con la conexión
const sequelize = new Sequalize('TTDB', 'postgres', `${config.get('db.password')}`, {
   host: 'localhost',
   dialect: 'postgres',
   pool: {
      max: 5,
      min: 0,
      require: 30000,
      idle: 10000
   },
   logging: true,
   freezeTableName: true
});

module.exports = sequelize;