const { validateUserAuth } = require('../schemas/User.validations');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * Verificar la validéz de los parametros del body
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {CallableFunction} callBackValidation 
 */
function getValidParams(req, res, callBackValidation) {
   const { error } = callBackValidation(req.body);
   return (error) ? res.status(400).send(error.details[0].message) : req.body;
}


/**
 * Crear un usuario: 
 * 1. verificando la existencia del usuario,
 * 2. creando el hash de la contraseña
 * 3. guardando el usuario 
 * 
 * @param {Object} Attributes
 */
export async function createUser(userAttributes) {
   try {
      const userExists = await verifyUser(userAttributes);
      if (userExists) return userExists;
      const passwordHashed = await hashPassword(userAttributes.user_password);
      userAttributes.user_password = passwordHashed;
      const userSaved = await saveUser(userAttributes);
      return userSaved;

   } catch (error) {
      throw error;

   }
}


function verifyUser(userAttributes) {
   return new Promise((resolve, reject) => {
      User.findOne({
         where: { user_email: userAttributes.user_email }
      }).then((result) => {
         if (result) resolve("User already registered");
         resolve();

      }).catch((error) => {
         reject(error);
      });
   });
}


function hashPassword(password) {
   return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then(function (hash) {
         resolve(hash);

      }).catch((error) => {
         reject(error);

      });
   });
}


function saveUser(userAttributes) {
   return new Promise((resolve, reject) => {
      User.create(
         userAttributes,
      ).then((created) => {
         if (created) resolve(created);

      }).catch((creationError) => {
         reject(creationError);

      });
   });
}


/**
 * Validar email y constraseña de un usuario:
 * 1. Validando del body
 * 2. Verificando el correo y la contraseña
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateUser(req, res) {
   const userAttributes = getValidParams(req, res, validateUserAuth);

   User.findOne({
      where: { user_email: userAttributes.user_email }
   }).then((result) => {
      if (!result) return res.status(400).send("Invalid email or password");

      bcrypt.compare(userAttributes.user_password, result.user_password, function (compareError, compareResponse) {
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

   }).catch((error) => {
      return res.status(500).send(error);

   });
}


/**
 * Eliminación de los usuarios con token de admin en el header 
 * y id en la ruta
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


/**
 * Actualizar el usuario con token de admin en el header 
 * y id en la ruta
 * 
 * @param {Request} req 
 * @param {Response} res
 * @return {Promise} promise 
 */
export async function updateUser(req, res) {
   const { id } = req.params;

   // Validacion del body
   const userAttributes = getValidParams(req, res, validateBodyUserUpdate);

   // Hash del password
   if (userAttributes.password) {
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

