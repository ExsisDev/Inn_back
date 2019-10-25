const { validateBodyUserCreation, validateUserAuth, validateBodyUserUpdate } = require('../schemas/user.validation');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../models/User');


function getValidParams(req, res, callBackValidation) {
   const { error } = callBackValidation(req.body);
   return (error) ? res.status(400).send(error.details[0].message) : req.body;
}


/**
 * Creación de un usuario: 
 * 1. verificando el body, 
 * 2. verificando la existencia del usuario,
 * 3. creando el usuario 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function createUser(req, res) {
   // Validacion del body
   const userAttributes = getValidParams(req, res, validateBodyUserCreation);

   // Cración del usuario
   User.findOne({
      where: { email: userAttributes.email }
   }).then((result) => {
      if (result) return res.status(400).send("User already registered");

      bcrypt.hash(userAttributes.password, 10).then(function (hash) {
         userAttributes.password = hash;
         User.create(
            userAttributes,
            {
               fields: ['name', 'password', 'email', 'is_admin']
            }).then((created) => {
               const token = created.generateAuthToken();
               return res.header('x-auth-token', token).status(200).send(_.pick(created, ['id_user', 'name', 'email', 'is_admin']));

            }).catch((creationError) => {
               return res.status(409).send(creationError);

            });
      });
   }).catch((error) => {
      return res.status(500).send(error);

   });
}


/**
 * Validación de email y constraseña de un administrador:
 * 1. Validando del body
 * 2. Verificando el correo y la contraseña
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateUser(req, res) {
   // Validacion del body
   const userAttributes = getValidParams(req, res, validateUserAuth);

   // Verificacion del usuario registrado
   User.findOne({
      where: { email: userAttributes.email }
   }).then((result) => {
      if (!result) return res.status(400).send("Invalid email or password");

      if (userAttributes.is_admin && !result.is_admin) return res.status(403).send("Access denied. Only admin access");
      if (!userAttributes.is_admin && result.is_admin) return res.status(403).send("Access denied. Only user access");

      bcrypt.compare(userAttributes.password, result.password, function (compareError, compareResponse) {
         if (compareError) return res.status(500).send("Error verifying password: ", compareError);
         if (!compareResponse) return res.status(400).send("Invalid email or password");

         const token = result.generateAuthToken();
         return res.header('x-auth-token', token).send("User authenticated");

      });
   }).catch((error) => {
      return res.status(500).send(error);

   });
}


/**
 * Retorna el usuario actual de acuerdo al token en el header
 *  
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function getCurrentUser(req, res) {
   // Encontrar el usuario con id en req.user.id_user
   User.findByPk(req.user.id_user).then((result) => {
      if (!result) return res.status(400).send("User does not exist");

      const token = result.generateAuthToken();
      return res.header('x-auth-token', token).send(_.pick(result, ['id_user', 'name', 'email', 'is_admin']));

   }).catch((error)=>{
      return res.status(500).send(error);

   });
}


/**
 * Eliminación de los usuarios solo por el administrador con token de admin en el header 
 * y id en la ruta de petición
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */
export async function deleteUser(req, res) {
   const { id } = req.params;

   // Encontrar el usuario a borrar
   User.findByPk(id).then((result) => {
      if (!result) return res.status(404).send("User not found");

      User.destroy({
         where: { id_user: id }
      }).then((deleteResult) => {
         if (deleteResult == 1) return res.status(200).send(_.pick(result, ['id_user', 'name', 'email', 'is_admin']));

      }).catch((deleteError) => {
         return res.status(409).send(deleteError);

      });
   }).catch((error) => {
      return res.status(500).send(error);

   });
}



export async function updateUser(req, res) {
   const { id } = req.params;

   // Validacion del body
   const userAttributes = getValidParams(req, res, validateBodyUserUpdate);

   // Hash del password
   if(userAttributes.password) {
      bcrypt.hash(userAttributes.password, 10).then(function (hash) {
         userAttributes.password = hash;
      });
   }

   // Actualizacion del usuario
   User.findByPk(id).then((result) => {
      if (!result) return res.status(404).send("User not found");

      result.update(userAttributes).then((updateResult) => {
            return res.status(200).send(_.pick(updateResult, ['id_user', 'name', 'email', 'is_admin']));
            
         }).catch((updateError) => {
            return res.status(409).send(updateError);

         });
   }).catch((error) => {
      return res.status(500).send(error);
   });
}

