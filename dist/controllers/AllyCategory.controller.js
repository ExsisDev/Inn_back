"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllAllyCategories = getAllAllyCategories;

var AllyCategory = require('../models/AllyCategory');

var config = require('config');
/**
 * Obtener todas las categorias por compañia
 * 
 * @param {Request} req 
 * @param {Response} res 
 */


function getAllAllyCategories(req, res) {
  return regeneratorRuntime.async(function getAllAllyCategories$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          AllyCategory.findAll().then(function (result) {
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