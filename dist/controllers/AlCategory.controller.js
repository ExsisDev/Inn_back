"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllAlCategories = getAllAlCategories;

var AlCategory = require('../models/AlCategory');

var config = require('config');
/**
 * Obtener todas las categorias de los aliados o compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */


function getAllAlCategories(req, res) {
  return regeneratorRuntime.async(function getAllAlCategories$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          AlCategory.findAll().then(function (result) {
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