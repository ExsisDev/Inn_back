"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProposal = createProposal;
exports.searchProposalByState = searchProposalByState;
exports.searchProposalByChallengeAndState = searchProposalByChallengeAndState;
exports.updateProposalByChallengeAndAlly = updateProposalByChallengeAndAlly;
exports.updateProposal = updateProposal;
exports.getProposalsAssignedByChallenge = getProposalsAssignedByChallenge;

var _Proposal = require("../schemas/Proposal.validation");

var Proposal = require('../models/Proposal');

var Ally = require('../models/Ally');

var ProposalState = require('../models/ProposalState');

var Challenge = require('../models/Challenge');

var Company = require('../models/Company');

var ChallengeCategory = require('../models/ChallengeCategory');

var ChCategories = require('../models/ChCategory');

var Resource = require('../models/Resource');

var _require = require('../schemas/Proposal.validation'),
    validateBodyProposalCreation = _require.validateBodyProposalCreation;

var config = require('config');

var jwt = require('jsonwebtoken');

var _require2 = require('../models/Enums/Challenge_state.enum'),
    challengeStateEnum = _require2.challengeStateEnum;

var _require3 = require('../models/Enums/Proposal_state.enum'),
    proposalStateEnum = _require3.proposalStateEnum;

var Mailer = require('../mailer/mailer');

var _require4 = require('../models/Enums/User_role.enums'),
    userRoleEnum = _require4.userRoleEnum;

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

function createProposal(req, res) {
  var newProposal, responseCreation, recipient;
  return regeneratorRuntime.async(function createProposal$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newProposal = getValidParams(req, res, validateBodyProposalCreation);
          Proposal.create(newProposal).then(function (result) {
            if (result) {
              responseCreation = result;
              return User.findOne({
                where: {
                  fk_id_role: userRoleEnum.get('ADMINISTRATOR').value
                }
              });
            }

            return res.status(500).send(config.get('unableToCreate'));
          }).then(function (admin) {
            recipient = admin.user_email; // recipient = "dago.fonseca@exsis.com.co";

            return Challenge.findByPk(newProposal.fk_id_challenge);
          }).then(function (challenge) {
            var creationDate = new Date(responseCreation.created_at);
            var msg = "Se recibi\xF3 una nueva propuesta para el reto ".concat(challenge.challenge_name, " el ").concat(creationDate);
            Mailer.sendTextMail(recipient, msg);
            return res.status(200).send(responseCreation);
          })["catch"](function (error) {
            if (error.errors !== undefined && error.errors[0].type === "unique violation") {
              return res.status(409).send("La propuesta ya ha sido enviada");
            }

            return res.status(500).send(error);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
} //----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

/**
 * Encontrar las propuestas del usuario (con el id del token) dado un estado y una página
 * @param {*} req 
 * @param {*} res 
 */


function searchProposalByState(req, res) {
  var itemsByPage, page, state, elementsCountByState, elementsByState, tokenElements, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, challenge;

  return regeneratorRuntime.async(function searchProposalByState$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          itemsByPage = 5;
          page = req.params.page;
          state = proposalStateEnum.get("".concat(req.params.status.toUpperCase())).value;
          tokenElements = jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'));
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(countElementsByState(state, tokenElements.id_user));

        case 7:
          elementsCountByState = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(getChallengesByPageAndState(itemsByPage, page, state, tokenElements.id_user));

        case 10:
          elementsByState = _context2.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 14;
          _iterator = elementsByState[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 24;
            break;
          }

          challenge = _step.value;
          _context2.next = 20;
          return regeneratorRuntime.awrap(getCategoriesByChallenge(challenge.challenge.id_challenge));

        case 20:
          challenge.dataValues['categories'] = _context2.sent;

        case 21:
          _iteratorNormalCompletion = true;
          _context2.next = 16;
          break;

        case 24:
          _context2.next = 30;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 30:
          _context2.prev = 30;
          _context2.prev = 31;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 33:
          _context2.prev = 33;

          if (!_didIteratorError) {
            _context2.next = 36;
            break;
          }

          throw _iteratorError;

        case 36:
          return _context2.finish(33);

        case 37:
          return _context2.finish(30);

        case 38:
          _context2.next = 44;
          break;

        case 40:
          _context2.prev = 40;
          _context2.t1 = _context2["catch"](4);
          console.log(_context2.t1);
          return _context2.abrupt("return", res.status(500).send(_context2.t1));

        case 44:
          _context2.prev = 44;
          return _context2.abrupt("return", res.send({
            result: elementsByState,
            count: elementsCountByState
          }));

        case 47:
        case "end":
          return _context2.stop();
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
    include: [{
      model: ProposalState,
      where: {
        id_proposal_state: state
      }
    }, {
      model: Ally,
      where: {
        fk_id_user: id_user
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
    }, {
      model: Ally,
      where: {
        fk_id_user: id_user
      }
    }]
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
} //----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

/**
 * Encontrar las propuestas por el id del reto, dado un estado y una página
 * @param {*} req 
 * @param {*} res 
 */


function searchProposalByChallengeAndState(req, res) {
  var itemsByPage, page, state, proposalsByState, challenge_id, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, challenge, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, proposal;

  return regeneratorRuntime.async(function searchProposalByChallengeAndState$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          itemsByPage = 5;
          page = req.params.page;
          state = proposalStateEnum.get("".concat(req.params.status.toUpperCase())).value; // let elementsCountByState;

          challenge_id = req.params.id_challenge;
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(getProposalsByChalengeAndState(itemsByPage, page, state, challenge_id));

        case 7:
          proposalsByState = _context3.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 11;
          _iterator2 = proposalsByState[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context3.next = 21;
            break;
          }

          challenge = _step2.value;
          _context3.next = 17;
          return regeneratorRuntime.awrap(getCategoriesByChallenge(challenge.challenge.id_challenge));

        case 17:
          challenge.dataValues['categories'] = _context3.sent;

        case 18:
          _iteratorNormalCompletion2 = true;
          _context3.next = 13;
          break;

        case 21:
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](11);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t0;

        case 27:
          _context3.prev = 27;
          _context3.prev = 28;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 30:
          _context3.prev = 30;

          if (!_didIteratorError2) {
            _context3.next = 33;
            break;
          }

          throw _iteratorError2;

        case 33:
          return _context3.finish(30);

        case 34:
          return _context3.finish(27);

        case 35:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 38;
          _iterator3 = proposalsByState[Symbol.iterator]();

        case 40:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context3.next = 48;
            break;
          }

          proposal = _step3.value;
          _context3.next = 44;
          return regeneratorRuntime.awrap(getResourcesByAlly(proposal.dataValues.fk_id_ally));

        case 44:
          proposal.dataValues['resources'] = _context3.sent;

        case 45:
          _iteratorNormalCompletion3 = true;
          _context3.next = 40;
          break;

        case 48:
          _context3.next = 54;
          break;

        case 50:
          _context3.prev = 50;
          _context3.t1 = _context3["catch"](38);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t1;

        case 54:
          _context3.prev = 54;
          _context3.prev = 55;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 57:
          _context3.prev = 57;

          if (!_didIteratorError3) {
            _context3.next = 60;
            break;
          }

          throw _iteratorError3;

        case 60:
          return _context3.finish(57);

        case 61:
          return _context3.finish(54);

        case 62:
          return _context3.abrupt("return", res.send({
            result: proposalsByState
          }));

        case 65:
          _context3.prev = 65;
          _context3.t2 = _context3["catch"](4);
          console.log(_context3.t2);
          return _context3.abrupt("return", res.status(500).send(_context3.t2));

        case 69:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 65], [11, 23, 27, 35], [28,, 30, 34], [38, 50, 54, 62], [55,, 57, 61]]);
}
/**
 * Encontrar los elementos por estado, pagina y cantidad
 * 
 * @param {Number} itemsByPage 
 * @param {Number} page 
 * @param {String} state 
 */


function getProposalsByChalengeAndState(itemsByPage, page, state, challenge_id) {
  return Proposal.findAll({
    offset: (page - 1) * itemsByPage,
    limit: 5,
    order: [['created_at', 'DESC']],
    where: {
      fk_id_challenge: challenge_id
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
    }, {
      model: Ally
    }]
  }).then(function (result) {
    return result ? result : null;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Obtener todos los recursos asociados a un aliado
 * @param {Numeric} idAlly 
 */


function getResourcesByAlly(idAlly) {
  return Resource.findAll({
    where: {
      fk_id_ally: idAlly
    },
    attributes: ['id_resource', 'resource_name', 'resource_profile', 'resource_experience']
  });
} //----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

/**
 * Actualizar los estados de la propuesta y el reto a asignados.
 * @param {*} req 
 * @param {*} res 
 */


function updateProposalByChallengeAndAlly(req, res) {
  var challenge_id, ally_id;
  return regeneratorRuntime.async(function updateProposalByChallengeAndAlly$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          challenge_id = req.params.id_challenge;
          ally_id = req.params.id_ally;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(assignProposalByChallengeAndAlly(challenge_id, ally_id));

        case 5:
          console.log(1);
          _context4.next = 8;
          return regeneratorRuntime.awrap(assignChallengeById(challenge_id));

        case 8:
          console.log(2);
          _context4.next = 11;
          return regeneratorRuntime.awrap(changeProposalStateToRejected(challenge_id));

        case 11:
          console.log(3);
          return _context4.abrupt("return", res.status(200).send({
            msg: "Propuesta asignada correctamente"
          }));

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](2);
          console.log(_context4.t0);
          return _context4.abrupt("return", res.status(500).send(_context4.t0));

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 15]]);
}
/**
 * Actualizar el estado de la propuesta de "SEND" a "ASSIGNED"
 * @param {*} id_challenge 
 * @param {*} id_ally 
 */


function assignProposalByChallengeAndAlly(id_challenge, id_ally) {
  return Proposal.update({
    fk_id_proposal_state: proposalStateEnum.get("ASSIGNED").value
  }, {
    where: {
      fk_id_challenge: id_challenge,
      fk_id_ally: id_ally
    }
  });
}
/**
 * Actualizar el estado del reto de "SEND" a "ASSIGNED"
 * @param {*} id_challenge 
 * @param {*} id_ally 
 */


function assignChallengeById(id_challenge) {
  return Challenge.update({
    fk_id_challenge_state: challengeStateEnum.get('ASSIGNED').value
  }, {
    where: {
      id_challenge: id_challenge
    }
  });
}
/**Change state  */


function changeProposalStateToRejected(id_challenge) {
  return Proposal.update({
    fk_id_proposal_state: proposalStateEnum.get('REJECTED').value
  }, {
    where: {
      fk_id_challenge: id_challenge,
      fk_id_proposal_state: 1
    }
  });
} //----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

/**
 * Actualizar la propuesta pasando en el body los atributos
 * @param {*} req 
 * @param {*} res 
 */


function updateProposal(req, res) {
  var bodyAttributes;
  return regeneratorRuntime.async(function updateProposal$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          bodyAttributes = getValidParams(req, res, _Proposal.validateBodyProposalUpdate);
          Proposal.update(bodyAttributes, {
            where: {
              fk_id_challenge: req.params.idChallenge,
              fk_id_ally: req.params.idAlly
            }
          }).then(function (updated) {
            return updated ? res.status(200).send(updated) : res.status(500).send(config.get('challenge.unableToUpdate'));
          })["catch"](function (error) {
            return res.status(500).send(config.get('challenge.unableToUpdate'));
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
} //----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

/**
 * Obtener propuestas asignada al reto
 * @param {*} req 
 * @param {*} res 
 */


function getProposalsAssignedByChallenge(req, res) {
  return regeneratorRuntime.async(function getProposalsAssignedByChallenge$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          Proposal.findAll({
            where: {
              fk_id_challenge: req.params.idChallenge,
              fk_id_proposal_state: 3
            }
          }).then(function (result) {
            return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
          })["catch"](function (error) {
            return res.status(500).send(config.get('seeLogs'));
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}