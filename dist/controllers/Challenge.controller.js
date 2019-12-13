"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChallenge = createChallenge;
exports.deleteChallenge = deleteChallenge;
exports.getChallengesByPageAndStatus = getChallengesByPageAndStatus;

var _require = require('../schemas/Challenge.validations'),
    validateBodyChallengeCreation = _require.validateBodyChallengeCreation,
    validateBodyChallengeUpdate = _require.validateBodyChallengeUpdate;

var _ = require('lodash');

var sequelize = require('../utils/database');

var Challenge = require('../models/Challenge');

var Company = require('../models/Company');

var ChallengeCategory = require('../models/ChallengeCategory');

var ChCategories = require('../models/ChCategory');

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
                    bodyChallenge['is_deleted'] = false;
                    _context.next = 7;
                    return regeneratorRuntime.awrap(createEmptyChallenge(bodyChallenge));

                  case 7:
                    challengeEmpty = _context.sent;
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 11;
                    _iterator = bodyCategories.categories_selected[Symbol.iterator]();

                  case 13:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context.next = 20;
                      break;
                    }

                    id_category = _step.value;
                    _context.next = 17;
                    return regeneratorRuntime.awrap(linkChallengeWithCategories(challengeEmpty.id_challenge, id_category));

                  case 17:
                    _iteratorNormalCompletion = true;
                    _context.next = 13;
                    break;

                  case 20:
                    _context.next = 26;
                    break;

                  case 22:
                    _context.prev = 22;
                    _context.t0 = _context["catch"](11);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                  case 26:
                    _context.prev = 26;
                    _context.prev = 27;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 29:
                    _context.prev = 29;

                    if (!_didIteratorError) {
                      _context.next = 32;
                      break;
                    }

                    throw _iteratorError;

                  case 32:
                    return _context.finish(29);

                  case 33:
                    return _context.finish(26);

                  case 34:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[11, 22, 26, 34], [27,, 29, 33]]);
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
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
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
 * Eliminar reto. Se actualiza columna is_deleted para que el
 * reto ya no sea tenido en cuenta.
 * @param {*} req 
 * @param {*} res 
 */


function deleteChallenge(req, res) {
  var challengeUpdated, id_challenge;
  return regeneratorRuntime.async(function deleteChallenge$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id_challenge = parseInt(req.params.idChallenge);

          if (!isNaN(id_challenge)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).send("Id no válido, idChallenge debe ser un entero."));

        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Challenge.update({
            is_deleted: true
          }, {
            where: {
              id_challenge: id_challenge
            }
          }));

        case 6:
          challengeUpdated = _context3.sent;
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](3);
          throw _context3.t0;

        case 12:
          _context3.prev = 12;

          if (!challengeUpdated) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.status(200).send("Reto eliminado"));

        case 15:
          return _context3.abrupt("return", res.status(500).send("No se pudo eliminar el reto"));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 9, 12, 17]]);
}
/**
 * Obtener los retos por pàgina y por estado, con total y categorias
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function getChallengesByPageAndStatus(req, res) {
  var itemsByPage, page, state, elementsCountByState, elementsByState, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, challenge;

  return regeneratorRuntime.async(function getChallengesByPageAndStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          itemsByPage = 5;
          page = req.params.page;
          state = challengeStateEnum.get("".concat(req.params.status.toUpperCase())).value;
          elementsByState = [];
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(countElementsByState(state));

        case 7:
          elementsCountByState = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(findChallengesByPageAndState(itemsByPage, page, state));

        case 10:
          elementsByState = _context4.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 14;
          _iterator2 = elementsByState[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 24;
            break;
          }

          challenge = _step2.value;
          _context4.next = 20;
          return regeneratorRuntime.awrap(findCategoriesByChallenge(challenge.id_challenge));

        case 20:
          challenge.dataValues['categories'] = _context4.sent;

        case 21:
          _iteratorNormalCompletion2 = true;
          _context4.next = 16;
          break;

        case 24:
          _context4.next = 30;
          break;

        case 26:
          _context4.prev = 26;
          _context4.t0 = _context4["catch"](14);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t0;

        case 30:
          _context4.prev = 30;
          _context4.prev = 31;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 33:
          _context4.prev = 33;

          if (!_didIteratorError2) {
            _context4.next = 36;
            break;
          }

          throw _iteratorError2;

        case 36:
          return _context4.finish(33);

        case 37:
          return _context4.finish(30);

        case 38:
          _context4.next = 44;
          break;

        case 40:
          _context4.prev = 40;
          _context4.t1 = _context4["catch"](4);
          console.log(_context4.t1);
          return _context4.abrupt("return", res.status(500).send(_context4.t1));

        case 44:
          _context4.prev = 44;
          return _context4.abrupt("return", elementsCountByState && elementsByState ? res.send({
            result: elementsByState,
            totalElements: elementsCountByState
          }) : res.status(404).send("No hay elementos disponibles"));

        case 47:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 40, 44, 47], [14, 26, 30, 38], [31,, 33, 37]]);
}
/**
 * Contar los elementos totales del estado
 * 
 * @param {String} state 
 */


function countElementsByState(state) {
  return Challenge.count({
    where: {
      'fk_id_challenge_state': state,
      'is_deleted': false
    }
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Encontrar los elementos por estado, pagina y cantidad
 * 
 * @param {Number} itemsByPage 
 * @param {Number} page 
 * @param {String} state 
 */


function findChallengesByPageAndState(itemsByPage, page, state) {
  return Challenge.findAll({
    offset: (page - 1) * itemsByPage,
    limit: itemsByPage,
    order: [['created_at', 'DESC']],
    where: {
      'fk_id_challenge_state': state,
      'is_deleted': false
    },
    include: [{
      model: Company,
      attributes: ['company_name', 'company_description']
    }]
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Encontrar todas los nombres de categorias por reto 
 * 
 * @param {Number} id_challenge 
 */


function findCategoriesByChallenge(id_challenge) {
  return ChallengeCategory.findAll({
    where: {
      'fk_id_challenge': id_challenge
    },
    include: [{
      model: ChCategories,
      attributes: ['category_name']
    }],
    attributes: []
  }).then(function (result) {
    var AllCategoriesResult = [];
    result.map(function (category) {
      AllCategoriesResult.push(category.ch_category.category_name);
    });
    return result ? AllCategoriesResult : undefined;
  })["catch"](function (error) {
    throw error;
  });
}