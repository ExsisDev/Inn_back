"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllSurveys = getAllSurveys;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../schemas/survey.validation'),
    validateBodySurveyCreation = _require.validateBodySurveyCreation,
    validateBodySurveyUpdate = _require.validateBodySurveyUpdate;

var _ = require('lodash');

var Survey = require('../models/Survey');

function getValidParams(req, res, callBackValidation) {
  var _callBackValidation = callBackValidation(req.body),
      error = _callBackValidation.error;

  return error ? res.status(400).send(error.details[0].message) : req.body;
}
/**
 * Retorna todas las encuestas
 * 
 * @param {Request} req 
 * @param {Response} res
 * @return {Promise} promise 
 */


function getAllSurveys(_x, _x2) {
  return _getAllSurveys.apply(this, arguments);
}

function _getAllSurveys() {
  _getAllSurveys = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Survey.findAll({
              order: ['id_survey']
            }).then(function (result) {
              return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
            })["catch"](function (error) {
              return res.status(500).send(error);
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAllSurveys.apply(this, arguments);
}