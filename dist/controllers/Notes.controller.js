"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotesByChallenge = getNotesByChallenge;
exports.createNote = createNote;

var _require = require('../schemas/Note.validation'),
    validateBodyNoteCreation = _require.validateBodyNoteCreation,
    validateBodyNoteUpdate = _require.validateBodyNoteUpdate;

var Note = require('../models/Note');
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
 * Obtener las notas por reto
 * @param {*} req 
 * @param {*} res 
 */


function getNotesByChallenge(req, res) {
  var id_challenge;
  return regeneratorRuntime.async(function getNotesByChallenge$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id_challenge = req.params.id_challenge;
          Note.findAll({
            where: {
              fk_id_challenge: id_challenge
            }
          }).then(function (result) {
            return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
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

function createNote(req, res) {
  var bodyAttributes;
  return regeneratorRuntime.async(function createNote$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          bodyAttributes = getValidParams(req, res, validateBodyNoteCreation);
          Note.create(bodyAttributes).then(function (result) {
            return result ? res.status(200).send(result) : res.status(500).send(config.get('unableToCreate'));
          })["catch"](function (error) {
            return res.status(500).send(error);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}