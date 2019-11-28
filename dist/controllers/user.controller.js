"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateAttempts = authenticateAttempts;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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


function authenticateAttempts(_x, _x2) {
  return _authenticateAttempts.apply(this, arguments);
}
/**
 * Obtener la hora de acceso
 * 
 * @param {String} email 
 * @return {String} hour
 */


function _authenticateAttempts() {
  _authenticateAttempts = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var userAttributes, userLastLogin, timeDifferenceInSeconds, dbDateUserLastLogin, nowDate, differenceBetweenDates;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userAttributes = getValidParams(req, res, validateUserAuth);
            _context2.prev = 1;
            _context2.next = 4;
            return getAccessHour(userAttributes.user_email);

          case 4:
            userLastLogin = _context2.sent;
            dbDateUserLastLogin = DateTime.fromJSDate(userLastLogin).setZone('America/Bogota');
            nowDate = DateTime.local().setZone('America/Bogota');
            differenceBetweenDates = dbDateUserLastLogin.diff(nowDate, 'milliseconds');

            if (userLastLogin) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.status(400).send("Correo o contraseña inválida"));

          case 10:
            timeDifferenceInSeconds = differenceBetweenDates.toObject().milliseconds / 1000; // Segundos de diferencia entre hora actual y hora en db

            if (!(timeDifferenceInSeconds <= 0)) {
              _context2.next = 17;
              break;
            }

            _context2.next = 14;
            return authenticateUser(res, userAttributes);

          case 14:
            return _context2.abrupt("return", _context2.sent);

          case 17:
            return _context2.abrupt("return", res.status(429).send({
              msj: "Exedió los intentos permitidos",
              minutes: differenceBetweenDates.toObject().milliseconds / (1000 * 60)
            }));

          case 18:
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", res.status(500).send(_context2.t0));

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 20]]);
  }));
  return _authenticateAttempts.apply(this, arguments);
}

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
  return new Promise(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var futureHour;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return findUser(userAttributes.user_email);

          case 2:
            userAuthenticated = _context.sent;

            if (userAuthenticated) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", res.status(400).send("Correo o contraseña inválida"));

          case 5:
            _context.next = 7;
            return comparePassword(userAttributes, userAuthenticated);

          case 7:
            passwordComparison = _context.sent;

            if (passwordComparison) {
              _context.next = 21;
              break;
            }

            _context.next = 11;
            return getLoginAttempts(userAttributes.user_email);

          case 11:
            attemptsCounter = _context.sent;
            _context.next = 14;
            return updateLoginCounter(userAttributes.user_email, attemptsCounter + 1);

          case 14:
            if (!(attemptsCounter + 1 == 5)) {
              _context.next = 20;
              break;
            }

            _context.next = 17;
            return updateLoginCounter(userAttributes.user_email, 0);

          case 17:
            futureHour = DateTime.local().setZone('America/Bogota').plus({
              minutes: minutesUntilAccess
            });
            _context.next = 20;
            return updateHour(userAttributes.user_email, futureHour);

          case 20:
            return _context.abrupt("return", res.status(400).send("Correo o contraseña inválida"));

          case 21:
            _context.next = 23;
            return updateHour(userAttributes.user_email, DateTime.local().setZone('America/Bogota'));

          case 23:
            _context.next = 25;
            return updateLoginCounter(userAttributes.user_email, 0);

          case 25:
            token = userAuthenticated.generateAuthToken();
            return _context.abrupt("return", res.header('x-auth-token', token).send("Usuario autenticado"));

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
}