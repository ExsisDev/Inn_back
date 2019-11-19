"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlly = createAlly;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../schemas/Ally.validations'),
    validateBodyAllyCreation = _require.validateBodyAllyCreation,
    validateBodyAllyUpdate = _require.validateBodyAllyUpdate,
    validateAllyAuth = _require.validateAllyAuth;

var _ = require('lodash');

var _require2 = require('luxon'),
    DateTime = _require2.DateTime;

var bcrypt = require('bcrypt');

var sequelize = require('../utils/database');

var Ally = require('../models/Ally');

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
 * Crear aliado:
 * 1. verificando el body, 
 * 2. comprobando la no existencia del usuario,
 * 3. creando el aliado 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function createAlly(_x, _x2) {
  return _createAlly.apply(this, arguments);
}
/**
 * Verificar existencia del usuario por email
 * 
 * @param {String} user_email 
 */


function _createAlly() {
  _createAlly = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var bodyAttributes, allyAttributes, userAttributes, userVerified, answer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bodyAttributes = getValidParams(req, res, validateBodyAllyCreation);
            allyAttributes = _.pick(bodyAttributes, ['ally_name', 'ally_nit', 'ally_web_page', 'ally_phone', 'ally_month_ideation_hours', 'ally_month_experimentation_hours']);
            userAttributes = _.pick(bodyAttributes, ['fk_id_role', 'fk_user_state', 'user_email', 'user_password']);
            userAttributes['user_last_login'] = DateTime.local().setZone('America/Bogota').toString();
            userAttributes['login_attempts'] = 0;
            _context.prev = 5;
            _context.next = 8;
            return verifyUser(userAttributes.user_email);

          case 8:
            userVerified = _context.sent;

            if (!userVerified) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", res.status(400).send("El correo ya ha sido registrado"));

          case 11:
            _context.next = 13;
            return hashPassword(userAttributes);

          case 13:
            _context.next = 15;
            return createUserAndAlly(userAttributes, allyAttributes);

          case 15:
            answer = _context.sent;
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](5);
            return _context.abrupt("return", res.status(400).send(_context.t0));

          case 21:
            _context.prev = 21;
            return _context.abrupt("return", res.send(answer));

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 18, 21, 24]]);
  }));
  return _createAlly.apply(this, arguments);
}

function verifyUser(user_email) {
  return User.findOne({
    where: {
      user_email: user_email
    }
  }).then(function (result) {
    return result ? result : null;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Hashear la contraseña y almacenarla en userAttributes
 * 
 * @param {Object} userAttributes 
 */


function hashPassword(userAttributes) {
  return bcrypt.hash(userAttributes.user_password, 10).then(function (hash) {
    userAttributes.user_password = hash;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Crear el usuario y acontinuación el aliado.
 * Dentro de una transacción de Sequalize
 * 
 * @param {Object} userAttributes 
 * @param {Object} allyAttributes 
 */


function createUserAndAlly(_x3, _x4) {
  return _createUserAndAlly.apply(this, arguments);
}

function _createUserAndAlly() {
  _createUserAndAlly = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(userAttributes, allyAttributes) {
    var userCreated, allyCreated, obj1, obj2, answerObject;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return sequelize.transaction(
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(t) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return User.create(userAttributes, {
                          transaction: t
                        }).then(function (result) {
                          allyAttributes['fk_id_user'] = result.id_user;
                          return result;
                        });

                      case 2:
                        userCreated = _context2.sent;
                        _context2.next = 5;
                        return Ally.create(allyAttributes, {
                          transaction: t
                        }).then(function (result) {
                          return result;
                        });

                      case 5:
                        allyCreated = _context2.sent;

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref.apply(this, arguments);
              };
            }());

          case 3:
            _context3.next = 8;
            break;

          case 5:
            _context3.prev = 5;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 8:
            _context3.prev = 8;

            if (!(userCreated && allyCreated)) {
              _context3.next = 14;
              break;
            }

            obj1 = _.omit(userCreated.dataValues, ['user_password']);
            obj2 = _.omit(allyCreated.dataValues, ['fk_id_user']);
            answerObject = _.assign(obj1, obj2);
            return _context3.abrupt("return", answerObject);

          case 14:
            return _context3.finish(8);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 5, 8, 15]]);
  }));
  return _createUserAndAlly.apply(this, arguments);
}