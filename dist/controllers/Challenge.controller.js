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

var sequelize = require('../utils/database');

var Challenge = require('../models/Challenge');

var ChallengeCategory = require('../models/ChallengeCategory');

var SurveyController = require('./Survey.controller');
/**
 * Verificar la validez de los parametros del body
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
 * Crear un nuevo reto
 * 1. Creando una encuesta
 * 2. Creando el reto 
 * 3. Asociando las categorias al reto
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function createChallenge(req, res) {
  var bodyAttributes, bodyChallenge, bodySurvey, bodyCategories, surveyCreated, challengeEmpty;
  return regeneratorRuntime.async(function createChallenge$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          bodyAttributes = getValidParams(req, res, validateBodyChallengeCreation);
          bodyChallenge = _.pick(bodyAttributes, ['fk_id_challenge_state', 'fk_id_company', 'challenge_name', 'challenge_description', 'close_date']);
          bodySurvey = _.pick(bodyAttributes, ['survey_date', 'user_id_creator']);
          bodyCategories = _.pick(bodyAttributes, ['categories_selected']);
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(sequelize.transaction(function _callee2(t) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(SurveyController.createSurvey(bodySurvey));

                  case 2:
                    surveyCreated = _context2.sent;
                    bodyChallenge['fk_id_survey'] = surveyCreated.id_survey;
                    _context2.next = 6;
                    return regeneratorRuntime.awrap(createEmptyChallenge(bodyChallenge));

                  case 6:
                    challengeEmpty = _context2.sent;
                    bodyCategories.categories_selected.map(function _callee(id_category) {
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap(linkChallengeWithCategories(challengeEmpty.id_challenge, id_category));

                            case 2:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    });

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 7:
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](4);
          console.log(_context3.t0);
          throw _context3.t0;

        case 13:
          _context3.prev = 13;

          if (!(surveyCreated && challengeEmpty)) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", surveyCreated ? res.status(200).send(surveyCreated) : res.status(500).send("No se pudo crear el elemento"));

        case 16:
          return _context3.abrupt("return", res.status(500).send(error));

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 9, 13, 18]]);
}
/**
 * Crear el reto vacio
 * 
 * @param {Object} bodyChallenge
 */


function createEmptyChallenge(bodyChallenge) {
  return Challenge.create(bodyChallenge).then(function (result) {
    return result ? result : undefined; // return result ? res.send(result) : res.status(500).send("No se pudo crear el elemento");
  })["catch"](function (error) {
    throw error; // return res.status(500).send(error);
  });
}
/**
 * Enlazar el reto con las categorias seleccionadas
 * @param {Object}  
 */


function linkChallengeWithCategories(id_challenge, id_category) {
  return ChallengeCategory.create({
    fk_id_challenge: id_challenge,
    fk_id_category: id_category
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
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
  return regeneratorRuntime.async(function getAllChallenges$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          Challenge.findAll().then(function (result) {
            return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
          })["catch"](function (error) {
            return res.status(500).send(error);
          });

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}