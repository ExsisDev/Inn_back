"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChallenge = createChallenge;
exports.getAllChallenges = getAllChallenges;

var _require = require('../schemas/Challenge.validations'),
    validateBodyChallengeCreation = _require.validateBodyChallengeCreation,
    validateBodyChallengeUpdate = _require.validateBodyChallengeUpdate;

var _ = require('lodash');

var Challenge = require('../models/Challenge');
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


function createChallenge(req, res) {
  var bodyAttributes;
  return regeneratorRuntime.async(function createChallenge$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          bodyAttributes = getValidParams(req, res, validateBodyChallengeCreation);
          Challenge.create(bodyAttributes).then(function (result) {
            return result ? res.send(result) : res.status(500).send("No se pudo crear el elemento");
          })["catch"](function (error) {
            return res.status(500).send(error);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}
/**
 * Obtener todos los retos
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function getAllChallenges(req, res) {
  return regeneratorRuntime.async(function getAllChallenges$(_context2) {
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
  });
}