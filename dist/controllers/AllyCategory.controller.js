"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllCompanyCategories = getAllCompanyCategories;

var CompanyCategory = require('../models/AllyCategory');
/**
 * Obtener todas las categorias de las compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */


function getAllCompanyCategories(req, res) {
  return regeneratorRuntime.async(function getAllCompanyCategories$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          CompanyCategory.findAll().then(function (result) {
            return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
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