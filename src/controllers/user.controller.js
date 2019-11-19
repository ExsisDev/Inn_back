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
 * Validar email y constraseña de un usuario de acuerdo a los intentos:
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateAttempts(req, res) {
   const userAttributes = getValidParams(req, res, validateUserAuth);

   let hour_until_access;
   let time_difference_in_seconds;

   try {
      hour_until_access = await getAccessHour(userAttributes.user_email);
      if (!hour_until_access) return res.status(400).send("Correo o contraseña inválida");
      time_difference_in_seconds = (new Date(hour_until_access).getTime() - new Date().getTime()) / (1000); // Segundos de diferencia entre hora actual y hora en db
      if (time_difference_in_seconds <= 0) {
         return await authenticateUser(res, userAttributes)
      }else{
         return res.status(429).send({msj: "Exedió los intentos permitidos", minutes: (new Date(hour_until_access.getTime() - new Date().getTime()).getMinutes())});
      }

   } catch (error) {
      return res.status(500).send(error);

   }
}


/**
 * Obtener la hora de acceso
 * 
 * @param {String} email 
 * @return {String} hour
 */
function getAccessHour(email) {
   return User.findOne({
      where: { user_email: email }
   }).then((result) => {
      return result ? result.hour_until_access : null;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Actualizar hora de acceso
 * 
 * @param {String} email 
 * @param {Date} hour 
 */
function updateHour(email, hour) {
   return User.update(
      { hour_until_access: hour },
      { where: { user_email: email } }
   ).then((result) => {
      return result;

   }).catch((error) => {
      throw error;
   });
}


/**
 * Actualizar contador de intentos
 * 
 * @param {String} email 
 * @param {Number} number 
 */
function updateLoginCounter(email, number) {
   return User.update(
      { login_attempts: number },
      { where: { user_email: email } }
   ).then((result) => {
      return result;

   }).catch((error) => {
      throw error;
   });
}


/**
 * Encontrar el usuario dado el email
 * 
 * @param {String} email 
 */
function findUser(email) {
   return User.findOne({
      where: { user_email: email }
   }).then((result) => {
      return result;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Verificar la validez de las contraseñas
 * 
 * @param {String} requestUser 
 * @param {String} databaseUser 
 */
function comparePassword(requestUser, databaseUser) {
   return new Promise((resolve, reject) => {
      bcrypt.compare(requestUser.user_password, databaseUser.user_password, function (compareError, compareResponse) {
         (compareError) ? reject(compareError) : resolve(compareResponse);

      });
   });
}


/**
 * Obtener los intentos
 * 
 * @param {String} email 
 */
function getLoginAttempts(email) {
   return User.findOne({
      where: { user_email: email }
   }).then((result) => {
      return result.login_attempts;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Autenticar el usuario
 * 
 * @param {Request} res 
 * @param {Object} userAttributes 
 */
function authenticateUser(res, userAttributes) {
   let userAuthenticated;
   let passwordComparison;
   let token;
   let attemptsCounter;
   const minutesUntilAccess = 5;

   return new Promise(async () => {
      userAuthenticated = await findUser(userAttributes.user_email);
      if (!userAuthenticated) return res.status(400).send("Correo o contraseña inválida");

      passwordComparison = await comparePassword(userAttributes, userAuthenticated);
      if (!passwordComparison) {
         attemptsCounter = await getLoginAttempts(userAttributes.user_email);
         await updateLoginCounter(userAttributes.user_email, attemptsCounter + 1);
         if (attemptsCounter + 1 == 5) {
            await updateLoginCounter(userAttributes.user_email, 0);
            const futureHour = new Date(new Date().getTime() + minutesUntilAccess * 60000);
            await updateHour(userAttributes.user_email, futureHour);
         }
         return res.status(400).send("Correo o contraseña inválida");

      }
      await updateHour(userAttributes.user_email, new Date());
      token = userAuthenticated.generateAuthToken();
      return res.header('x-auth-token', token).send("Usuario autenticado");

   });
}

