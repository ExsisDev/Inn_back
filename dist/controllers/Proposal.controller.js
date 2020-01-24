"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchProposalByState1 = searchProposalByState1;
exports.createProposal = createProposal;
exports.searchProposalByState = searchProposalByState;

var Proposal = require('../models/Proposal');

var ProposalState = require('../models/ProposalState');

var Challenge = require('../models/Challenge');

var Company = require('../models/Company');

var ChallengeCategory = require('../models/ChallengeCategory');

var ChCategories = require('../models/ChCategory');

var _require = require('../schemas/Proposal.validation'),
    validateBodyProposalCreation = _require.validateBodyProposalCreation;

var config = require('config');

var jwt = require('jsonwebtoken');

var _require2 = require('../models/Enums/Challenge_state.enum'),
    challengeStateEnum = _require2.challengeStateEnum;

var _require3 = require('../models/Enums/Proposal_state.enum'),
    proposalStateEnum = _require3.proposalStateEnum;
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

function searchProposalByState1(req, res) {
  return regeneratorRuntime.async(function searchProposalByState1$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  });
}

function createProposal(req, res) {
  var newProposal;
  return regeneratorRuntime.async(function createProposal$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          newProposal = getValidParams(req, res, validateBodyProposalCreation);
          Proposal.create(newProposal).then(function (result) {
            return result ? res.status(200).send(result) : res.status(500).send(config.get('unableToCreate'));
          })["catch"](function (error) {
            if (error.errors[0].type === "unique violation") {
              return res.status(409).send("La propuesta ya ha sido enviada");
            }

            return res.status(500).send(error);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/**
 * Encontrar las propuestas del usuario (con el id del token) dado un estado y una página
 * @param {*} req 
 * @param {*} res 
 */


function searchProposalByState(req, res) {
  var itemsByPage, page, state, elementsCountByState, elementsByState, tokenElements, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, challenge;

  return regeneratorRuntime.async(function searchProposalByState$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          itemsByPage = 5;
          page = req.params.page;
          state = proposalStateEnum.get("".concat(req.params.status.toUpperCase())).value;
          tokenElements = jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'));
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(countElementsByState(state, tokenElements.id_user));

        case 7:
          elementsCountByState = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(getChallengesByPageAndState(itemsByPage, page, state, tokenElements.id_user));

        case 10:
          elementsByState = _context3.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 14;
          _iterator = elementsByState[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 24;
            break;
          }

          challenge = _step.value;
          _context3.next = 20;
          return regeneratorRuntime.awrap(getCategoriesByChallenge(challenge.challenge.id_challenge));

        case 20:
          challenge.dataValues['categories'] = _context3.sent;

        case 21:
          _iteratorNormalCompletion = true;
          _context3.next = 16;
          break;

        case 24:
          _context3.next = 30;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 30:
          _context3.prev = 30;
          _context3.prev = 31;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 33:
          _context3.prev = 33;

          if (!_didIteratorError) {
            _context3.next = 36;
            break;
          }

          throw _iteratorError;

        case 36:
          return _context3.finish(33);

        case 37:
          return _context3.finish(30);

        case 38:
          _context3.next = 44;
          break;

        case 40:
          _context3.prev = 40;
          _context3.t1 = _context3["catch"](4);
          console.log(_context3.t1);
          return _context3.abrupt("return", res.status(500).send(_context3.t1));

        case 44:
          _context3.prev = 44;
          return _context3.abrupt("return", res.send({
            result: elementsByState,
            count: elementsCountByState
          }));

        case 47:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 40, 44, 47], [14, 26, 30, 38], [31,, 33, 37]]);
}
/**
 * Contar los elementos totales del estado
 * 
 * @param {String} state 
 */


function countElementsByState(state, id_user) {
  return Proposal.count({
    where: {
      fk_id_ally: id_user
    },
    include: [{
      model: ProposalState,
      where: {
        id_proposal_state: state
      }
    }]
  }).then(function (result) {
    return result ? result : 0;
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


function getChallengesByPageAndState(itemsByPage, page, state, id_user) {
  return Proposal.findAll({
    offset: (page - 1) * itemsByPage,
    limit: 5,
    order: [['created_at', 'DESC']],
    where: {
      fk_id_ally: id_user
    },
    include: [{
      model: Challenge,
      include: [{
        model: Company
      }]
    }, {
      model: ProposalState,
      where: {
        id_proposal_state: state
      }
    }]
  }).then(function (result) {
    return result ? result : null;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Encontrar todas los nombres de categorias por reto 
 * 
 * @param {Number} id_challenge 
 */


function getCategoriesByChallenge(id_challenge) {
  return ChallengeCategory.findAll({
    where: {
      fk_id_challenge: id_challenge
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