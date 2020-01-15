"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResourcesByAllyId = getResourcesByAllyId;
exports.deleteAllyResources = deleteAllyResources;

var _ = require('lodash');

var Resource = require('../models/Resource');

function getResourcesByAllyId(req, res) {
  var id_ally, answer;
  return regeneratorRuntime.async(function getResourcesByAllyId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id_ally = parseInt(req.params.allyId);

          if (!(!Number.isInteger(id_ally) || id_ally <= 0)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo"));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(getAllyResources(id_ally));

        case 6:
          answer = _context.sent;
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(500).send("Algo salió mal. Mira los logs para mayor información"));

        case 13:
          if (!(answer.code && answer.code === 404)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(404).send(answer.message));

        case 15:
          return _context.abrupt("return", res.status(200).send(answer));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 9]]);
}
/**
 * Obtener los recursos correspondientes a un aliado
 * @param {Number} id_ally Entero positivo que representa el id del aliado
 * @returns {Array} Un arreglo con los recursos encontrados
 */


function getAllyResources(id_ally) {
  return Resource.findAll({
    where: {
      fk_id_ally: id_ally
    },
    attributes: ['id_resource', 'resource_name', 'resource_profile', 'resource_experience']
  }).then(function (result) {
    if (result === null) {
      var error = {
        code: 404,
        message: "No se encontraron recursos con el id dado"
      };
      return error;
    }

    return result;
  })["catch"](function (error) {
    console.log(error);
    throw error;
  });
}
/**
 * Eliminar de base de datos el recurso de un aliado
 * @param {*} req 
 * @param {*} res 
 */


function deleteAllyResources(req, res) {
  var id_ally, id_resource, answer;
  return regeneratorRuntime.async(function deleteAllyResources$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id_ally = parseInt(req.params.allyId);
          id_resource = parseInt(req.params.resourceId);

          if (!(!Number.isInteger(id_ally) || id_ally <= 0)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo"));

        case 4:
          if (!(!Number.isInteger(id_resource) || id_resource <= 0)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Id inválido. el id del recurso debe ser un entero positivo"));

        case 6:
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(Resource.destroy({
            where: {
              id_resource: id_resource,
              fk_id_ally: id_ally
            }
          }));

        case 9:
          answer = _context2.sent;

          if (!answer) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(200).send("Recurso identificado con el id ".concat(id_resource, " fue eliminado")));

        case 12:
          return _context2.abrupt("return", res.status(404).send("Recurso no encontrado"));

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](6);
          return _context2.abrupt("return", res.status(500).send('Algo salió mal. Revise los logs para mayor información.'));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 15]]);
}