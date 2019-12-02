"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createArtist = createArtist;
exports.getAllArtists = getAllArtists;
exports.getByArtistId = getByArtistId;
exports.updateArtist = updateArtist;
exports.deleteArtist = deleteArtist;
exports.getArtistsByIdCategory = getArtistsByIdCategory;

var _require = require('../schemas/artist.validation'),
    validateBodyArtistCreation = _require.validateBodyArtistCreation,
    validateBodyArtistUpdate = _require.validateBodyArtistUpdate;

var Artist = require('../models/Artist');

var Artist_Category = require('../models/Artist_Category');

var Category = require('../models/Category');

function createArtist(req, res) {
  var _validateBodyArtistCr, error, _req$body, full_name, email, address, phone_number, start_date, birth_date;

  return regeneratorRuntime.async(function createArtist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //Validación del body
          _validateBodyArtistCr = validateBodyArtistCreation(req.body), error = _validateBodyArtistCr.error;

          if (!error) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send(error.details[0].message));

        case 3:
          //Cración del artista
          _req$body = req.body, full_name = _req$body.full_name, email = _req$body.email, address = _req$body.address, phone_number = _req$body.phone_number, start_date = _req$body.start_date, birth_date = _req$body.birth_date;
          return _context.abrupt("return", Artist.create({
            full_name: full_name,
            email: email,
            address: address,
            phone_number: phone_number,
            start_date: start_date,
            birth_date: birth_date
          }, {
            fields: ['full_name', 'email', 'address', 'phone_number', 'start_date', 'birth_date']
          }).then(function (result) {
            result ? res.status(200).send(result) : res.status(500).send("No se pudo crear el elemento");
          })["catch"](function (error) {
            res.status(409).send(error);
          }));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getAllArtists(req, res) {
  return regeneratorRuntime.async(function getAllArtists$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", Artist.findAll({
            order: ['id_artist']
          }).then(function (result) {
            result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
          })["catch"](function (error) {
            res.status(500).send(error);
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getByArtistId(req, res) {
  var id;
  return regeneratorRuntime.async(function getByArtistId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          //Obtener el elemento
          id = req.params.id;
          return _context3.abrupt("return", Artist.findOne({
            where: {
              id_artist: id
            }
          }).then(function (result) {
            result ? res.status(200).send(result) : res.status(404).send("No existe el elemento con id ".concat(id));
          })["catch"](function (error) {
            res.status(500).send(error);
          }));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function updateArtist(req, res) {
  var _validateBodyArtistUp, error, id, bodyAttributes;

  return regeneratorRuntime.async(function updateArtist$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          //Validación del body
          _validateBodyArtistUp = validateBodyArtistUpdate(req.body), error = _validateBodyArtistUp.error;

          if (!error) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).send(error.details[0].message));

        case 3:
          //Actualización del artista
          id = req.params.id;
          bodyAttributes = req.body;
          Artist.findByPk(id).then(function (result) {
            if (!result) res.status(404).send("No existe el elemento con id ".concat(id));
            return result.update(bodyAttributes).then(function (updated) {
              res.status(200).send(updated);
            })["catch"](function (error) {
              res.status(500).send(error);
              console.log("En el update");
            });
          })["catch"](function (error) {
            res.status(500).send(error);
            console.log("En el find");
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function deleteArtist(req, res) {
  var id;
  return regeneratorRuntime.async(function deleteArtist$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          Artist.findByPk(id).then(function (result) {
            if (!result) res.status(404).send("No existe el elemento con id ".concat(id));
            return Artist.destroy({
              where: {
                id_artist: id
              }
            }).then(function (deleted) {
              res.status(200).send(result);
            })["catch"](function (error) {
              res.status(500).send(error);
            });
          })["catch"](function (error) {
            res.status(500).send(error);
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function getArtistsByIdCategory(req, res) {
  var id_category;
  return regeneratorRuntime.async(function getArtistsByIdCategory$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id_category = req.params.id_category;
          return _context6.abrupt("return", Artist.findAll({
            attributes: ['id_artist', 'full_name', 'email', 'address', 'phone_number', 'start_date', 'birth_date'],
            include: [{
              model: Artist_Category,
              where: {
                fk_id_category: id_category
              },
              attributes: [],
              include: [{
                model: Category,
                attributes: ['category_name']
              }]
            }],
            raw: true
          }).then(function (result) {
            result.length > 0 ? res.status(200).send(result) : res.status(404).send("No existe el elemento con id ".concat(id));
          })["catch"](function (error) {
            res.status(404).send("No existe el elemento con id ".concat(id_category));
          }));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
}