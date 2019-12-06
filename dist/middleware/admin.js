"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = isAdmin;

var _require = require('../models/Enums/User_role.enums'),
    userRoleEnum = _require.userRoleEnum;
/**
 * Middleware para verificar si el token enviado 
 * es de un administrador o de un usuario 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 */


function isAdmin(req, res, next) {
  if (req.user.fk_id_role !== userRoleEnum.get('ADMINISTRATOR').value) return res.status(403).send("Access denied. Only admin access");
  next();
}