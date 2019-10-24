const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Middleware de verificación de token
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {FunctionStringCallback} next 
 */
export function auth(req, res, next) {
   const token = req.header('x-auth-token');
   if(!token) res.status(401).send('Access denied. No token provided');

   try {
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      req.user = decoded;
      next();   
   } catch (error) {
      res.status(400).send('Invalid token.');
   }
}