"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateAttempts = authenticateAttempts;
exports.changePassword = changePassword;
exports.generateRecoveryToken = generateRecoveryToken;
exports.recoverPassword = recoverPassword;
exports.validateRecoveryToken = validateRecoveryToken;

var _require = require('../schemas/User.validations'),
    validateUserAuth = _require.validateUserAuth,
    validatePasswordChange = _require.validatePasswordChange,
    validateEmail = _require.validateEmail,
    validateRecoveryPassword = _require.validateRecoveryPassword;

var sequelize = require('../utils/database');

var _ = require('lodash');

var _require2 = require('luxon'),
    DateTime = _require2.DateTime;

var bcrypt = require('bcrypt');

var crypto = require('crypto');

var User = require('../models/User');

var config = require('config');

var Mailer = require('../mailer/mailer');
/**
 * Verificar la validéz de los parametros del body
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {CallableFunction} callBackValidation 
 */


function getValidParams(req, res, callBackValidation) {
  var _callBackValidation = callBackValidation(req.body),
      error = _callBackValidation.error;

  return error ? res.status(400).send(error.details[0].message) : req.body;
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


function authenticateAttempts(req, res) {
  var userAttributes, userLastLogin, timeDifferenceInSeconds, dbDateUserLastLogin, nowDate, differenceBetweenDates;
  return regeneratorRuntime.async(function authenticateAttempts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userAttributes = getValidParams(req, res, validateUserAuth);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(getAccessHour(userAttributes.user_email));

        case 4:
          userLastLogin = _context.sent;
          dbDateUserLastLogin = DateTime.fromJSDate(userLastLogin).setZone('America/Bogota');
          nowDate = DateTime.local().setZone('America/Bogota');
          differenceBetweenDates = dbDateUserLastLogin.diff(nowDate, 'milliseconds');

          if (userLastLogin) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).send(config.get('user.invalidEmailOrPassword')));

        case 10:
          timeDifferenceInSeconds = differenceBetweenDates.toObject().milliseconds / 1000; // Segundos de diferencia entre hora actual y hora en db

          if (!(timeDifferenceInSeconds <= 0)) {
            _context.next = 17;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(authenticateUser(res, userAttributes));

        case 14:
          return _context.abrupt("return", _context.sent);

        case 17:
          return _context.abrupt("return", res.status(429).send({
            msj: config.get('user.exceededTryAccess'),
            minutes: differenceBetweenDates.toObject().milliseconds / (1000 * 60)
          }));

        case 18:
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", res.status(500).send(_context.t0));

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 20]]);
}
/**
 * Obtener la hora de acceso
 * 
 * @param {String} email 
 * @return {String} hour
 */


function getAccessHour(email) {
  return User.findOne({
    where: {
      user_email: email
    }
  }).then(function (result) {
    return result ? result.user_last_login : null;
  })["catch"](function (error) {
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
  return User.update({
    user_last_login: hour
  }, {
    where: {
      user_email: email
    }
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
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
  return User.update({
    login_attempts: number
  }, {
    where: {
      user_email: email
    }
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
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
  var minutesUntilAccess = 5;
  var userAuthenticated;
  var passwordComparison;
  var token;
  var attemptsCounter;
  return new Promise(function _callee() {
    var futureHour;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(findUserByEmail(userAttributes.user_email));

          case 2:
            userAuthenticated = _context2.sent;

            if (userAuthenticated) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.status(400).send(config.get('user.invalidEmailOrPassword')));

          case 5:
            _context2.next = 7;
            return regeneratorRuntime.awrap(comparePassword(userAttributes.user_password, userAuthenticated.user_password));

          case 7:
            passwordComparison = _context2.sent;

            if (passwordComparison) {
              _context2.next = 21;
              break;
            }

            _context2.next = 11;
            return regeneratorRuntime.awrap(getLoginAttempts(userAttributes.user_email));

          case 11:
            attemptsCounter = _context2.sent;
            _context2.next = 14;
            return regeneratorRuntime.awrap(updateLoginCounter(userAttributes.user_email, attemptsCounter + 1));

          case 14:
            if (!(attemptsCounter + 1 == 5)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 17;
            return regeneratorRuntime.awrap(updateLoginCounter(userAttributes.user_email, 0));

          case 17:
            futureHour = DateTime.local().setZone('America/Bogota').plus({
              minutes: minutesUntilAccess
            });
            _context2.next = 20;
            return regeneratorRuntime.awrap(updateHour(userAttributes.user_email, futureHour));

          case 20:
            return _context2.abrupt("return", res.status(400).send(config.get('user.invalidEmailOrPassword')));

          case 21:
            _context2.next = 23;
            return regeneratorRuntime.awrap(updateHour(userAttributes.user_email, DateTime.local().setZone('America/Bogota')));

          case 23:
            _context2.next = 25;
            return regeneratorRuntime.awrap(updateLoginCounter(userAttributes.user_email, 0));

          case 25:
            token = userAuthenticated.generateAuthToken();
            return _context2.abrupt("return", res.set('x-auth-token', token).set('Access-Control-Expose-Headers', 'x-auth-token').send(config.get('authenticated')));

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}
/**
 * Encontrar el usuario dado el email
 * 
 * @param {String} email 
 */


function findUserByEmail(email) {
  return User.findOne({
    where: {
      user_email: email
    }
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
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
  return new Promise(function (resolve, reject) {
    bcrypt.compare(requestPassword, databasePassword, function (compareError, compareResponse) {
      compareError ? reject(compareError) : resolve(compareResponse);
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
    where: {
      user_email: email
    }
  }).then(function (result) {
    return result ? result.login_attempts : undefined;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Verificar contraseña:
 * 1. Corroborando que la contraseña actual es correcta
 * 2. Las contraseñas nuevas son iguales
 * 3. Actualizando la contraseña
 */


function changePassword(req, res) {
  var userAttributes, tokenElements, idUser, userRequestPassword, userDataBasePassword, isCorrectPassword, hashedPassword, updated;
  return regeneratorRuntime.async(function changePassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          userAttributes = getValidParams(req, res, validatePasswordChange);
          tokenElements = User.getTokenElements(req.headers['x-auth-token']);
          idUser = tokenElements.id_user;
          userRequestPassword = userAttributes.actual_password;
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(findUserById(idUser));

        case 7:
          userDataBasePassword = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(comparePassword(userRequestPassword, userDataBasePassword).then(function (isCorrect) {
            isCorrectPassword = isCorrect;
          }));

        case 10:
          if (!isCorrectPassword) {
            _context3.next = 22;
            break;
          }

          if (!(userAttributes.new_password == userAttributes.confirm_new_password)) {
            _context3.next = 21;
            break;
          }

          _context3.next = 14;
          return regeneratorRuntime.awrap(hashPassword(userAttributes.new_password));

        case 14:
          hashedPassword = _context3.sent;
          _context3.next = 17;
          return regeneratorRuntime.awrap(updateUserPassword(hashedPassword, idUser));

        case 17:
          updated = _context3.sent;
          return _context3.abrupt("return", res.status(200).send(updated));

        case 21:
          return _context3.abrupt("return", res.status(400).send(config.get('user.passwordsDoesntMatch')));

        case 22:
          return _context3.abrupt("return", res.status(400).send(config.get('invalidPassword')));

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](4);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).send(_context3.t0));

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 25]]);
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
  }).then(function (result) {
    return result ? result.user_password : undefined;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Hashear contraseña
 * 
 * @param {String} unhashedPassword 
 */


function hashPassword(unhashedPassword) {
  return bcrypt.hash(unhashedPassword, 10).then(function (hash) {
    return hash ? hash : undefined;
  })["catch"](function (error) {
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
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
  });
} //----------------------------------------------------------------------------------
//-------------------------- Recover password --------------------------------------

/**
 * Generar link con token para recuperar contraseña
 * @param {*} req 
 * @param {*} res 
 */


function generateRecoveryToken(req, res) {
  var bodyParams, userFound, hash, minutesUntilAccess;
  return regeneratorRuntime.async(function generateRecoveryToken$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          bodyParams = getValidParams(req, res, validateEmail);
          minutesUntilAccess = 15;
          User.findOne({
            where: {
              user_email: bodyParams.user_email
            }
          }).then(function (result) {
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
          }).then(function (hash) {
            var futureHour = DateTime.local().setZone('America/Bogota').plus({
              minutes: minutesUntilAccess
            });
            return User.update({
              recovery_token: hash,
              recovery_token_expiration: futureHour
            }, {
              where: {
                id_user: userFound.id_user
              }
            });
          }).then(function (resultUpdate) {
            // let recipient = "dago.fonseca@exsis.com.co";
            var message = "<h2>Recuperación de contraseña</h2>";
            message += "<p><a href=\"".concat(config.get('url_front'), "/recover-password/").concat(userFound.id_user, "/").concat(hash, "\">Haz click aqu\xED para recuperar tu contrase\xF1a</a></p>");
            Mailer.sendHtmlMail(userFound.user_email, message); // Mailer.sendHtmlMail(recipient, message);

            return res.status(200).send("Link the recuperación generado exitosamente");
          })["catch"](function (error) {
            return res.status(500).send(config.get('seeLogs'));
          });

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
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


function recoverPassword(req, res) {
  var reqBody, message, code, hashedPassword;
  return regeneratorRuntime.async(function recoverPassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          reqBody = getValidParams(req, res, validateRecoveryPassword);
          _context5.next = 3;
          return regeneratorRuntime.awrap(validateRecoveryTokenByUser(reqBody.id_user, reqBody.recovery_token));

        case 3:
          code = _context5.sent;

          if (!(code !== 200)) {
            _context5.next = 17;
            break;
          }

          _context5.t0 = code;
          _context5.next = _context5.t0 === 404 ? 8 : _context5.t0 === 401 ? 10 : _context5.t0 === 410 ? 12 : _context5.t0 === 500 ? 14 : 16;
          break;

        case 8:
          message = "Usuario no encontrado.";
          return _context5.abrupt("break", 16);

        case 10:
          message = "El código de recuperación no es válido.";
          return _context5.abrupt("break", 16);

        case 12:
          message = "El código de recuperación a expirado.";
          return _context5.abrupt("break", 16);

        case 14:
          message = config.get('seeLogs');
          return _context5.abrupt("break", 16);

        case 16:
          return _context5.abrupt("return", res.status(code).send(message));

        case 17:
          if (!(reqBody.new_password !== reqBody.confirm_new_password)) {
            _context5.next = 19;
            break;
          }

          return _context5.abrupt("return", res.status(400).send(config.get('user.passwordsDoesntMatch')));

        case 19:
          _context5.prev = 19;
          _context5.next = 22;
          return regeneratorRuntime.awrap(hashPassword(reqBody.new_password));

        case 22:
          hashedPassword = _context5.sent;
          _context5.next = 25;
          return regeneratorRuntime.awrap(User.update({
            user_password: hashedPassword,
            recovery_token: null,
            recovery_token_expiration: null
          }, {
            where: {
              id_user: reqBody.id_user
            }
          }));

        case 25:
          return _context5.abrupt("return", res.status(200).send("Contraseña recuperada con éxito."));

        case 28:
          _context5.prev = 28;
          _context5.t1 = _context5["catch"](19);
          return _context5.abrupt("return", res.status(500).send(config.get('seeLogs')));

        case 31:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[19, 28]]);
}
/**
 * Validar token de recuperación de contraseña
 * 1. Se revisa que exista un usuario con el id dado
 * 2. Se valida que el token recibido sea igual al token en base de datos
 * 3. Se valida que la fecha de expiración del token sea mayor a la fecha actual
 * @param {*} req 
 * @param {*} res 
 */


function validateRecoveryToken(req, res) {
  var token, id_user, message, code;
  return regeneratorRuntime.async(function validateRecoveryToken$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          token = req.params.token;
          id_user = parseInt(req.params.idUser);

          if (!(!Number.isInteger(id_user) || id_user <= 0)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).send(config.get('user.invalidIdUser')));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(validateRecoveryTokenByUser(id_user, token));

        case 6:
          code = _context6.sent;
          _context6.t0 = code;
          _context6.next = _context6.t0 === 404 ? 10 : _context6.t0 === 401 ? 12 : _context6.t0 === 410 ? 14 : _context6.t0 === 200 ? 16 : _context6.t0 === 500 ? 18 : 20;
          break;

        case 10:
          message = "Usuario no encontrado.";
          return _context6.abrupt("break", 20);

        case 12:
          message = "El código de recuperación no es válido.";
          return _context6.abrupt("break", 20);

        case 14:
          message = "El código de recuperación a expirado.";
          return _context6.abrupt("break", 20);

        case 16:
          message = "Código de recuperarción válido";
          return _context6.abrupt("break", 20);

        case 18:
          message = config.get('seeLogs');
          return _context6.abrupt("break", 20);

        case 20:
          return _context6.abrupt("return", res.status(code).send(message));

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  });
}
/**
 * 1. Se revisa que exista un usuario con el id dado
 * 2. Se valida que el token recibido sea igual al token en base de datos
 * 3. Se valida que la fecha de expiración del token sea mayor a la fecha actual
 * @param {*} id_user 
 * @param {*} res 
 */


function validateRecoveryTokenByUser(id_user, token) {
  return User.findByPk(id_user, {
    attributes: ['recovery_token', 'recovery_token_expiration']
  }).then(function (userFound) {
    if (!userFound) {
      return 404;
    }

    if (userFound.recovery_token !== token) {
      return 401;
    }

    var recoveryTokenExpirationDate = DateTime.fromJSDate(userFound.recovery_token_expiration);

    if (recoveryTokenExpirationDate.diffNow().toObject().milliseconds <= 0) {
      return 410;
    }

    return 200;
  })["catch"](function (error) {
    console.log(error);
    return 500;
  });
}