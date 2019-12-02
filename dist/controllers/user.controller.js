"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateAttempts = authenticateAttempts;

var _require = require('../schemas/User.validations'),
    validateUserAuth = _require.validateUserAuth;

var _ = require('lodash');

var _require2 = require('luxon'),
    DateTime = _require2.DateTime;

var bcrypt = require('bcrypt');

var User = require('../models/User');
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

          return _context.abrupt("return", res.status(400).send("Correo o contraseña inválida"));

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
            msj: "Excedió los intentos permitidos",
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
    return result;
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
    return result;
  })["catch"](function (error) {
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
    where: {
      user_email: email
    }
  }).then(function (result) {
    return result;
  })["catch"](function (error) {
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
  return new Promise(function (resolve, reject) {
    bcrypt.compare(requestUser.user_password, databaseUser.user_password, function (compareError, compareResponse) {
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
    return result.login_attempts;
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
            return regeneratorRuntime.awrap(findUser(userAttributes.user_email));

          case 2:
            userAuthenticated = _context2.sent;

            if (userAuthenticated) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.status(400).send("Correo o contraseña inválida"));

          case 5:
            _context2.next = 7;
            return regeneratorRuntime.awrap(comparePassword(userAttributes, userAuthenticated));

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
            return _context2.abrupt("return", res.status(400).send("Correo o contraseña inválida"));

          case 21:
            _context2.next = 23;
            return regeneratorRuntime.awrap(updateHour(userAttributes.user_email, DateTime.local().setZone('America/Bogota')));

          case 23:
            _context2.next = 25;
            return regeneratorRuntime.awrap(updateLoginCounter(userAttributes.user_email, 0));

          case 25:
            token = userAuthenticated.generateAuthToken();
            return _context2.abrupt("return", res.set('x-auth-token', token).set('Access-Control-Expose-Headers', 'x-auth-token').send("Usuario autenticado"));

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}