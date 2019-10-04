function logging(req, res, next){
   console.log('Logging...');
   next();
}

function authenticating(req, res, next){
   console.log('Authenticating...');
   next();
}

module.exports = {
   logging,
   authenticating
};