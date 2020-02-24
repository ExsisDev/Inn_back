const { validateUserAuth, validatePasswordChange, validateEmail, validateRecoveryPassword } = require('../schemas/User.validations');
const sequelize = require('../utils/database');
const _ = require('lodash');
const { DateTime } = require('luxon');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const config = require('config');
const Mailer = require('../mailer/mailer');

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
 * 1. Obtiene la hora de acceso
 * 2. Calcula la diferencia entre horas
 * 3. Permite o no el acceso 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateAttempts(req, res) {
   const userAttributes = getValidParams(req, res, validateUserAuth);

   let userLastLogin;
   let timeDifferenceInSeconds;

   try {
      userLastLogin = await getAccessHour(userAttributes.user_email);

      const dbDateUserLastLogin = DateTime.fromJSDate(userLastLogin).setZone('America/Bogota');
      const nowDate = DateTime.local().setZone('America/Bogota');
      const differenceBetweenDates = dbDateUserLastLogin.diff(nowDate, 'milliseconds');

      if (!userLastLogin) return res.status(400).send(config.get('user.invalidEmailOrPassword'));
      timeDifferenceInSeconds = (differenceBetweenDates.toObject().milliseconds) / (1000); // Segundos de diferencia entre hora actual y hora en db

      if (timeDifferenceInSeconds <= 0) {
         return await authenticateUser(res, userAttributes);
      } else {
         return res.status(429).send({ msj: config.get('user.exceededTryAccess'), minutes: (differenceBetweenDates.toObject().milliseconds / (1000 * 60)) });
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
      return result ? result.user_last_login : null;

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
      { user_last_login: hour },
      { where: { user_email: email } }

   ).then((result) => {
      return result ? result : undefined;

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
      return result ? result : undefined;

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

   const minutesUntilAccess = 5;
   let userAuthenticated;
   let passwordComparison;
   let token;
   let attemptsCounter;

   return new Promise(async () => {
      userAuthenticated = await findUserByEmail(userAttributes.user_email);
      if (!userAuthenticated) return res.status(400).send(config.get('user.invalidEmailOrPassword'));

      passwordComparison = await comparePassword(userAttributes.user_password, userAuthenticated.user_password);
      if (!passwordComparison) {
         attemptsCounter = await getLoginAttempts(userAttributes.user_email);
         await updateLoginCounter(userAttributes.user_email, attemptsCounter + 1);

         if (attemptsCounter + 1 == 5) {
            await updateLoginCounter(userAttributes.user_email, 0);
            const futureHour = DateTime.local().setZone('America/Bogota').plus({ minutes: minutesUntilAccess });
            await updateHour(userAttributes.user_email, futureHour);
         }
         return res.status(400).send(config.get('user.invalidEmailOrPassword'));

      }
      await updateHour(userAttributes.user_email, DateTime.local().setZone('America/Bogota'));
      await updateLoginCounter(userAttributes.user_email, 0);
      token = userAuthenticated.generateAuthToken();
      return res.set('x-auth-token', token).set('Access-Control-Expose-Headers', 'x-auth-token').send(config.get('authenticated'));

   });
}


/**
 * Encontrar el usuario dado el email
 * 
 * @param {String} email 
 */
function findUserByEmail(email) {
   return User.findOne({
      where: { user_email: email }

   }).then((result) => {
      return result ? result : undefined;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Verificar la validez de las contraseñas
 * 
 * @param {String} requestPassword 
 * @param {String} databasePassword 
 */
function comparePassword(requestPassword, databasePassword) {
   return new Promise((resolve, reject) => {
      bcrypt.compare(requestPassword, databasePassword, function (compareError, compareResponse) {
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
      return result ? result.login_attempts : undefined;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Verificar contraseña:
 * 1. Corroborando que la contraseña actual es correcta
 * 2. Las contraseñas nuevas son iguales
 * 3. Actualizando la contraseña
 */
export async function changePassword(req, res) {
   const userAttributes = getValidParams(req, res, validatePasswordChange);
   const tokenElements = User.getTokenElements(req.headers['x-auth-token']);

   let idUser = tokenElements.id_user;
   let userRequestPassword = userAttributes.actual_password;
   let userDataBasePassword;
   let isCorrectPassword;

   try {
      userDataBasePassword = await findUserById(idUser);
      await comparePassword(userRequestPassword, userDataBasePassword).then((isCorrect) => {
         isCorrectPassword = isCorrect;
      });
      if (isCorrectPassword) {
         if (userAttributes.new_password == userAttributes.confirm_new_password) {
            const hashedPassword = await hashPassword(userAttributes.new_password)
            const updated = await updateUserPassword(hashedPassword, idUser);
            return res.status(200).send(updated);
         } else {
            return res.status(400).send(config.get('user.passwordsDoesntMatch'));
         }
      }
      return res.status(400).send(config.get('invalidPassword'));
   } catch (error) {
      console.log(error)
      return res.status(500).send(error);
   }

}


/**
 * Encontrar un usuario por su id
 * 
 * @param {Number} id_user 
 * @returns {String} user_password
 */
function findUserById(id_user) {
   return User.findOne({
      where: {
         id_user: id_user
      }
   }).then((result) => {
      return result ? result.user_password : undefined;

   }).catch((error) => {
      throw error;

   })
}


/**
 * Hashear contraseña
 * 
 * @param {String} unhashedPassword 
 */
function hashPassword(unhashedPassword) {
   return bcrypt.hash(unhashedPassword, 10).then((hash) => {
      return hash ? hash : undefined;
   }).catch((error) => {
      throw error;
   });
}


/**
 * Actualizar la contraseña en la base de datos 
 *  
 * @param {String} newPassword 
 * @param {Number} id_user 
 */
function updateUserPassword(newHashedPassword, id_user) {
   return User.update({
      user_password: newHashedPassword
   }, {
      where: {
         id_user: id_user
      }
   }).then((result) => {
      return result ? result : undefined;
   }).catch((error) => {
      throw error;
   })
}

//----------------------------------------------------------------------------------
//-------------------------- Recover password --------------------------------------

/**
 * Generar link con token para recuperar contraseña
 * @param {*} req 
 * @param {*} res 
 */
export async function generateRecoveryToken(req, res) {
   const bodyParams = getValidParams(req, res, validateEmail);
   let userFound, hash, minutesUntilAccess = 15;
   User.findOne({
      where: {
         user_email: bodyParams.user_email
      }
   }).then((result) => {
      if (!result) {
         return res.status(400).send('El email proporcionado no se encuentra registrado.');
      }
      userFound = result;
      try {
         hash = crypto.randomBytes(64).toString('hex');
         return hash;
      } catch (error) {
         console.log(error);
         return res.status(500).send('Algo salió mal. Para mayor información revisar los logs.');
      }
   }).then((hash) => {
      const futureHour = DateTime.local().setZone('America/Bogota').plus({ minutes: minutesUntilAccess });
      return User.update({
         recovery_token: hash,
         recovery_token_expiration: futureHour
      }, {
         where: { id_user: userFound.id_user }
      })
   }).then((resultUpdate) => {
      // let recipient = "dago.fonseca@exsis.com.co";
      let message = "<h2>Recuperación de contraseña</h2>";
      message += `<p><a href="${config.get('url_front')}/recover-password/${userFound.id_user}/${hash}">Haz click aquí para recuperar tu contraseña</a></p>`;
      Mailer.sendHtmlMail(userFound.user_email, message);
      // Mailer.sendHtmlMail(recipient, message);
      return res.status(200).send("Link the recuperación generado exitosamente");
   }).catch((error) => {
      return res.status(500).send(config.get('seeLogs'));
   })
}

/**
 * Recuperar contraseña del usuario
 * 1. Se validan los parametros del request
 * 2. Se valida el recovery token
 * 3. Se validan que las contraseñas coincidan
 * 4. Se actualiza user_password, recovery_token y recovery_token_expiration
 * @param {*} req 
 * @param {*} res 
 */
export async function recoverPassword(req, res) {
   const reqBody = getValidParams(req, res, validateRecoveryPassword);
   let message, code;
   code = await validateRecoveryTokenByUser(reqBody.id_user, reqBody.recovery_token);
   if (code !== 200) {
      switch (code) {
         case 404:
            message = "Usuario no encontrado.";
            break;
         case 401:
            message = "El código de recuperación no es válido.";
            break;
         case 410:
            message = "El código de recuperación a expirado.";
            break;
         case 500:
            message = config.get('seeLogs');
            break;
      }
      return res.status(code).send(message);
   }
   if (reqBody.new_password !== reqBody.confirm_new_password) {
      return res.status(400).send(config.get('user.passwordsDoesntMatch'));
   }
   try {
      const hashedPassword = await hashPassword(reqBody.new_password)
      await User.update({
         user_password: hashedPassword,
         recovery_token: null,
         recovery_token_expiration: null
      }, {
         where: { id_user: reqBody.id_user }
      });
      return res.status(200).send("Contraseña recuperada con éxito.");
   } catch (error) {
      return res.status(500).send(config.get('seeLogs'));
   }
}

/**
 * Validar token de recuperación de contraseña
 * 1. Se revisa que exista un usuario con el id dado
 * 2. Se valida que el token recibido sea igual al token en base de datos
 * 3. Se valida que la fecha de expiración del token sea mayor a la fecha actual
 * @param {*} req 
 * @param {*} res 
 */
export async function validateRecoveryToken(req, res) {
   const token = req.params.token;
   const id_user = parseInt(req.params.idUser);
   let message, code;

   if (!Number.isInteger(id_user) || id_user <= 0) {
      return res.status(400).send(config.get('user.invalidIdUser'));
   }
   code = await validateRecoveryTokenByUser(id_user, token);
   switch (code) {
      case 404:
         message = "Usuario no encontrado.";
         break;
      case 401:
         message = "El código de recuperación no es válido.";
         break;
      case 410:
         message = "El código de recuperación a expirado.";
         break;
      case 200:
         message = "Código de recuperarción válido";
         break;
      case 500:
         message = config.get('seeLogs');
         break;
   }
   return res.status(code).send(message);
}
/**
 * 1. Se revisa que exista un usuario con el id dado
 * 2. Se valida que el token recibido sea igual al token en base de datos
 * 3. Se valida que la fecha de expiración del token sea mayor a la fecha actual
 * @param {*} id_user 
 * @param {*} res 
 */
function validateRecoveryTokenByUser(id_user, token) {
   return User.findByPk(id_user, { attributes: ['recovery_token', 'recovery_token_expiration'] })
      .then(userFound => {
         if (!userFound) {
            return 404;
         }
         if (userFound.recovery_token !== token) {
            return 401;
         }
         let recoveryTokenExpirationDate = DateTime.fromJSDate(userFound.recovery_token_expiration);
         if (recoveryTokenExpirationDate.diffNow().toObject().milliseconds <= 0) {
            return 410;
         }
         return 200;
      }).catch(error => {
         console.log(error);
         return 500;
      })
}