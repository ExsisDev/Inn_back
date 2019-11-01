"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = isAdmin;

/**
 * Middleware para verificar si el token enviado 
 * es de un administrador o de un usuario 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 */
function isAdmin(req, res, next) {
  if (!req.user.is_admin) return res.status(403).send("Access denied. Only admin access");
  next();
}