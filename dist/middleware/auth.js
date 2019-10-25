"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = auth;

var jwt = require('jsonwebtoken');

var config = require('config');
/**
 * Middleware de verificación de token
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {FunctionStringCallback} next 
 */


function auth(req, res, next) {
  var token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    var decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
}