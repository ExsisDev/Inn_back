"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlly = createAlly;
exports.createAllyOptional = createAllyOptional;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../schemas/Ally.validations'),
    validateBodyAllyCreation = _require.validateBodyAllyCreation,
    validateBodyAllyUpdate = _require.validateBodyAllyUpdate,
    validateAllyAuth = _require.validateAllyAuth;

var _ = require('lodash');

var bcrypt = require('bcrypt');

var sequelize = require('../utils/database');

var Ally = require('../models/Ally');

var User = require('../models/User');

var UserController = require('./User.controller');
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

function _createAlly() {
  _createAlly = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var bodyAttributes, allyAttributes, userAttributes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bodyAttributes = getValidParams(req, res, validateBodyAllyCreation);
            allyAttributes = _.pick(bodyAttributes, ['ally_name', 'ally_nit', 'ally_web_page', 'ally_phone', 'ally_month_ideation_hours', 'ally_month_experimentation_hours']);
            userAttributes = _.pick(bodyAttributes, ['fk_id_role', 'fk_user_state', 'user_email', 'user_password', 'user_last_login']);
            UserController.createUser(userAttributes).then(function (userCreated) {
              if (userCreated === "User already registered") {
                return res.status(400).send(userCreated);
              }

              var token = userCreated.generateAuthToken();
              allyAttributes['fk_id_user'] = userCreated.id_user;
              Ally.create(allyAttributes).then(function (allyCreated) {
                if (allyCreated) {
                  return res.header('x-auth-token', token).status(200).send(_.assign(_.omit(userCreated.dataValues, ['user_password']), _.omit(allyCreated.dataValues, ['fk_id_user'])));
                } else {
                  return res.status(500).send("No se pudo crear el elemento");
                }
              })["catch"](function (error) {
                return res.status(500).send(error);
              });
            })["catch"](function (error) {
              return res.status(500).send(error);
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createAlly.apply(this, arguments);
}

function createAllyOptional(_x3, _x4) {
  return _createAllyOptional.apply(this, arguments);
}

function _createAllyOptional() {
  _createAllyOptional = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var bodyAttributes, allyAttributes, userAttributes, userVerified, answer;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            bodyAttributes = getValidParams(req, res, validateBodyAllyCreation);
            allyAttributes = _.pick(bodyAttributes, ['ally_name', 'ally_nit', 'ally_web_page', 'ally_phone', 'ally_month_ideation_hours', 'ally_month_experimentation_hours']);
            userAttributes = _.pick(bodyAttributes, ['fk_id_role', 'fk_user_state', 'user_email', 'user_password', 'user_last_login']);
            userVerified = {};
            answer = {};
            _context2.prev = 5;
            _context2.next = 8;
            return verifyUser(userAttributes);

          case 8:
            userVerified = _context2.sent;
            _context2.next = 11;
            return hashPassword(userAttributes);

          case 11:
            _context2.next = 13;
            return createUserAndAlly(userAttributes, allyAttributes);

          case 13:
            answer = _context2.sent;
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](5);
            return _context2.abrupt("return", res.status(500).send(_context2.t0));

          case 19:
            _context2.prev = 19;

            if (!userVerified) {
              _context2.next = 22;
              break;
            }

            return _context2.abrupt("return", res.status(404).send("El correo ya ha sido registrado"));

          case 22:
            return _context2.abrupt("return", res.send(answer));

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 16, 19, 24]]);
  }));
  return _createAllyOptional.apply(this, arguments);
}

function verifyUser(userAttributes) {
  return User.findOne({
    where: {
      user_email: userAttributes.user_email
    }
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
  });
}

function hashPassword(userAttributes) {
  return bcrypt.hash(userAttributes.user_password, 10).then(function (hash) {
    userAttributes.user_password = hash;
  })["catch"](function (error) {
    throw error;
  });
}

function createUserAndAlly(_x5, _x6) {
  return _createUserAndAlly.apply(this, arguments);
}

function _createUserAndAlly() {
  _createUserAndAlly = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(userAttributes, allyAttributes) {
    var userCreated, allyCreated, answerObject;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            allyCreated = {};
            _context4.prev = 1;
            _context4.next = 4;
            return sequelize.transaction(
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3(t) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return User.create(userAttributes, {
                          transaction: t
                        }).then(function (result) {
                          allyAttributes['fk_id_user'] = result.id_user;
                        });

                      case 2:
                        userCreated = _context3.sent;
                        _context3.next = 5;
                        return Ally.create(allyAttributes, {
                          transaction: t
                        });

                      case 5:
                        allyCreated = _context3.sent;

                      case 6:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x7) {
                return _ref.apply(this, arguments);
              };
            }());

          case 4:
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](1);
            throw _context4.t0;

          case 9:
            _context4.prev = 9;
            answerObject = _.assign(_.omit(userCreated.dataValues, ['user_password']), _.omit(allyCreated.dataValues, ['fk_id_user'])); // console.log(answerObject);

            return _context4.abrupt("return", {
              a: "a",
              answerObject: answerObject
            });

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 6, 9, 13]]);
  }));
  return _createUserAndAlly.apply(this, arguments);
}