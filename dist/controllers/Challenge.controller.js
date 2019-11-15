"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChallenge = createChallenge;
exports.getAllChallenges = getAllChallenges;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../schemas/Challenge.validations'),
    validateBodyChallengeCreation = _require.validateBodyChallengeCreation,
    validateBodyChallengeUpdate = _require.validateBodyChallengeUpdate;

var _ = require('lodash');

var Challenge = require('../models/Challenge');

var Company = require('../models/Company');
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


function createChallenge(_x, _x2) {
  return _createChallenge.apply(this, arguments);
}
/**
 * Obtener todos los retos
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function _createChallenge() {
  _createChallenge = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var bodyAttributes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bodyAttributes = getValidParams(req, res, validateBodyChallengeCreation);
            Challenge.create(bodyAttributes).then(function (result) {
              return result ? res.send(result) : res.status(404).send("No se pudo crear el elemento");
            })["catch"](function (error) {
              return res.status(500).send(error);
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createChallenge.apply(this, arguments);
}

function getAllChallenges(_x3, _x4) {
  return _getAllChallenges.apply(this, arguments);
}

function _getAllChallenges() {
  _getAllChallenges = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            Challenge.findAll().then(function (result) {
              return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
            })["catch"](function (error) {
              return res.status(500).send(error);
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getAllChallenges.apply(this, arguments);
}