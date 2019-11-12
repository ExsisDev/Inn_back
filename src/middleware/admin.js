const { userRoleEnum } = require('../models/Enums/User_role.enums');
/**
 * Middleware para verificar si el token enviado 
 * es de un administrador o de un usuario 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 */
export function isAdmin(req, res, next) {
   if (req.user.fk_id_role !== userRoleEnum.Administrator.value)
      return res.status(403).send("Access denied. Only admin access");

   next();
}