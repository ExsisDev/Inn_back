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
 * Validar email y constraseña de un usuario:
 * 1. Validando del body
 * 2. Verificando el correo y la contraseña
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateAttempts(req, res) {
   const userAttributes = getValidParams(req, res, validateUserAuth);

   let hour_until_access;
   let time_difference_in_hours;

   try {
      hour_until_access = await catchAccessHour(userAttributes.user_email);
      time_difference_in_hours = (new Date(hour_until_access).getTime() - new Date().getTime()) / (1000); // Segundos de diferencia
      console.log(time_difference_in_hours);
      if (time_difference_in_hours <= 0) { // ya pasó la hora de bloqueo
         console.log(await updateHour(userAttributes.user_email, new Date()));
         return await authenticateUser(res, userAttributes);

      }
      
   } catch (error) {
      console.log(error);
      return res.status(500).send(error);

   } finally {

   }
}


function catchAccessHour(email) {
   return User.findOne({
      where: { user_email: email }
   }).then((result) => {
      return result.hour_until_access;

   }).catch((error) => {
      throw error;

   });
}


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


function findUser(email) {
   return User.findOne({
      where: { user_email: email }
   }).then((result) => {
      return result;

   }).catch((error) => {
      throw error;

   });
}


function comparePassword(requestUser, databaseUser) {
   return new Promise((resolve, reject) => {
      bcrypt.compare(requestUser.user_password, databaseUser.user_password, function (compareError, compareResponse) {
         if (compareError) reject(compareError);
         resolve(compareResponse);

      });
   });
}


function getLoginAttempts(email) {
   return User.findOne({
      where: { user_email: email }
   }).then((result) => {
      return result.login_attempts;

   }).catch((error) => {
      throw error;

   });
}


function authenticateUser(res, userAttributes) {
   let userAuthenticated;
   let passwordComparison;
   let token;
   let attemptsCounter;
   const minutesUntilAccess = 5;

   return new Promise(async () => {
      userAuthenticated = await findUser(userAttributes.user_email);
      if (!userAuthenticated) return res.status(400).send("Invalid email or password");

      passwordComparison = await comparePassword(userAttributes, userAuthenticated);
      if (!passwordComparison) {
         attemptsCounter = await getLoginAttempts(userAttributes.user_email);
         console.log(attemptsCounter);
         await updateLoginCounter(userAttributes.user_email, attemptsCounter + 1);
         if (attemptsCounter + 1 == 5) {
            await updateLoginCounter(userAttributes.user_email, 0);
            const actualHour = new Date();
            const futureHour = new Date(actualHour.getTime() + minutesUntilAccess * 60000);
            await updateHour(userAttributes.user_email, futureHour);
         }
         return res.status(400).send("Invalid email or password");
      }

      token = userAuthenticated.generateAuthToken();
      return res.header('x-auth-token', token).send("User authenticated");


   });
}


/**
 * Retorna el usuario actual de acuerdo al token en el header
 *
 * @param {Request} req
 * @param {Response} res
 * @return {promise} promise
 */
// export async function getCurrentUser(req, res) {
//    // Encontrar el usuario con id en req.user.id_user
//    User.findByPk(req.user.id_user).then((result) => {
//       if (!result) return res.status(400).send("User does not exist");

//       const token = result.generateAuthToken();
//       return res.header('x-auth-token', token).send(_.pick(result, ['id_user', 'name', 'email', 'is_admin']));

//    }).catch((error) => {
//       return res.status(500).send(error);

//    });
// }


/**
 * Eliminación de los usuarios con token de admin en el header
 * y id en la ruta
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Promise} promise
 */
// export async function deleteUser(req, res) {
//    const { id } = req.params;

//    // Encontrar el usuario a borrar
//    User.findByPk(id).then((result) => {
//       if (!result) return res.status(404).send("User not found");

//       User.destroy({
//          where: { id_user: id }
//       }).then((deleteResult) => {
//          if (deleteResult == 1) return res.status(200).send(_.pick(result, ['id_user', 'name', 'email', 'is_admin']));

//       }).catch((deleteError) => {
//          return res.status(409).send(deleteError);

//       });
//    }).catch((error) => {
//       return res.status(500).send(error);

//    });
// }


/**
 * Actualizar el usuario con token de admin en el header
 * y id en la ruta
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Promise} promise
 */
// export async function updateUser(req, res) {
//    const { id } = req.params;

//    // Validacion del body
//    const userAttributes = getValidParams(req, res, validateBodyUserUpdate);

//    // Hash del password
//    if (userAttributes.password) {
//       bcrypt.hash(userAttributes.password, 10).then(function (hash) {
//          userAttributes.password = hash;
//       });
//    }

//    // Actualizacion del usuario
//    User.findByPk(id).then((result) => {
//       if (!result) return res.status(404).send("User not found");

//       result.update(userAttributes).then((updateResult) => {
//          return res.status(200).send(_.pick(updateResult, ['id_user', 'name', 'email', 'is_admin']));

//       }).catch((updateError) => {
//          return res.status(409).send(updateError);

//       });
//    }).catch((error) => {
//       return res.status(500).send(error);
//    });
// }

