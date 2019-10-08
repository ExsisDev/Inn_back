export function logging(req, res, next) {
   console.log('Logging...');
   next();
}

export function authenticating(req, res, next) {
   console.log('Authenticating...');
   next();
}

