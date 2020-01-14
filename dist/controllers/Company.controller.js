"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllCompanies = getAllCompanies;

var Company = require('../models/Company');

var config = require('config');
/**
 * Obtener todas las compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */


function getAllCompanies(req, res) {
  return regeneratorRuntime.async(function getAllCompanies$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          Company.findAll().then(function (result) {
            return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
          })["catch"](function (error) {
            return res.status(500).send(error);
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}