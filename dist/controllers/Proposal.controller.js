"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProposal = createProposal;

var Proposal = require('../models/Proposal');

var _require = require('../schemas/Proposal.validation'),
    validateBodyProposalCreation = _require.validateBodyProposalCreation;

var config = require('config');
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
  var newProposal;
  return regeneratorRuntime.async(function createProposal$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newProposal = getValidParams(req, res, validateBodyProposalCreation);
          Proposal.create(newProposal).then(function (result) {
            return result ? res.status(200).send(result) : res.status(500).send(config.get('unableToCreate'));
          })["catch"](function (error) {
            console.log(error);
            return res.status(500).send(error);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}