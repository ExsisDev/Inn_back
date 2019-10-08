const logs = {
   logging: (req, res, next) => {
      console.log('Logging...');
      next();
   },
   authenticating: (req, res, next) => {
      console.log('Authenticating...');
      next();
   }
}

module.exports = logs;