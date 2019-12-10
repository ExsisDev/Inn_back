"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChallenge = createChallenge;
exports.getAllChallenges = getAllChallenges;
exports.getChallengesByPageAndStatus = getChallengesByPageAndStatus;

var _require = require('../schemas/Challenge.validations'),
    validateBodyChallengeCreation = _require.validateBodyChallengeCreation,
    validateBodyChallengeUpdate = _require.validateBodyChallengeUpdate;

var _ = require('lodash');

var sequelize = require('../utils/database');

var Challenge = require('../models/Challenge');

var ChallengeCategory = require('../models/ChallengeCategory');

var SurveyController = require('./Survey.controller');

var _require2 = require('../models/Enums/Challenge_state.enum'),
    challengeStateEnum = _require2.challengeStateEnum;
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
  return regeneratorRuntime.async(function createChallenge$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          bodyAttributes = getValidParams(req, res, validateBodyChallengeCreation);
          bodyChallenge = _.pick(bodyAttributes, ['fk_id_challenge_state', 'fk_id_company', 'challenge_name', 'challenge_description', 'close_date']);
          bodySurvey = _.pick(bodyAttributes, ['survey_date', 'user_id_creator']);
          bodyCategories = _.pick(bodyAttributes, ['categories_selected']);
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(sequelize.transaction(function _callee(t) {
            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id_category;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(SurveyController.createSurvey(bodySurvey));

                  case 2:
                    surveyCreated = _context.sent;
                    bodyChallenge['fk_id_survey'] = surveyCreated.id_survey;
                    _context.next = 6;
                    return regeneratorRuntime.awrap(createEmptyChallenge(bodyChallenge));

                  case 6:
                    challengeEmpty = _context.sent;
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 10;
                    _iterator = bodyCategories.categories_selected[Symbol.iterator]();

                  case 12:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context.next = 19;
                      break;
                    }

                    id_category = _step.value;
                    _context.next = 16;
                    return regeneratorRuntime.awrap(linkChallengeWithCategories(challengeEmpty.id_challenge, id_category));

                  case 16:
                    _iteratorNormalCompletion = true;
                    _context.next = 12;
                    break;

                  case 19:
                    _context.next = 25;
                    break;

                  case 21:
                    _context.prev = 21;
                    _context.t0 = _context["catch"](10);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                  case 25:
                    _context.prev = 25;
                    _context.prev = 26;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 28:
                    _context.prev = 28;

                    if (!_didIteratorError) {
                      _context.next = 31;
                      break;
                    }

                    throw _iteratorError;

                  case 31:
                    return _context.finish(28);

                  case 32:
                    return _context.finish(25);

                  case 33:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[10, 21, 25, 33], [26,, 28, 32]]);
          }));

        case 7:
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](4);
          console.log(_context2.t0);
          throw _context2.t0;

        case 13:
          _context2.prev = 13;

          if (!(surveyCreated && challengeEmpty)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", challengeEmpty ? res.status(200).send(challengeEmpty) : res.status(500).send("No se pudo crear el elemento"));

        case 16:
          return _context2.abrupt("return", res.status(500).send(error));

        case 18:
        case "end":
          return _context2.stop();
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
  return regeneratorRuntime.async(function getAllChallenges$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", Challenge.findAll().then(function (result) {
            return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
          })["catch"](function (error) {
            return res.status(500).send(error);
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}
/**
 * Obtener los retos por pàgina y por estado
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function getChallengesByPageAndStatus(req, res) {
  var itemsByPage, page, status, totalElementsByState;
  return regeneratorRuntime.async(function getChallengesByPageAndStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          itemsByPage = 5;
          page = req.params.page;
          status = req.params.status.toUpperCase();
          _context4.next = 5;
          return regeneratorRuntime.awrap(Challenge.count({
            where: {
              'fk_id_challenge_state': challengeStateEnum.get("".concat(status)).value
            }
          }).then(function (result) {
            totalElementsByState = result;
          })["catch"](function (error) {
            return res.status(500).send(error);
          }));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(Challenge.findAll({
            offset: (page - 1) * itemsByPage,
            limit: itemsByPage,
            order: [['created_at', 'DESC']],
            where: {
              'fk_id_challenge_state': challengeStateEnum.get("".concat(status)).value
            }
          }).then(function (result) {
            return result ? res.send({
              result: result,
              totalElements: totalElementsByState
            }) : res.status(404).send("No hay elementos disponibles");
          })["catch"](function (error) {
            return res.status(500).send(error);
          }));

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}