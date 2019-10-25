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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../schemas/artist.validation'),
    validateBodyArtistCreation = _require.validateBodyArtistCreation,
    validateBodyArtistUpdate = _require.validateBodyArtistUpdate;

var Artist = require('../models/Artist');

var Artist_Category = require('../models/Artist_Category');

var Category = require('../models/Category');

function createArtist(_x, _x2) {
  return _createArtist.apply(this, arguments);
}

function _createArtist() {
  _createArtist = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _validateBodyArtistCr, error, _req$body, full_name, email, address, phone_number, start_date, birth_date;

    return regeneratorRuntime.wrap(function _callee$(_context) {
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
    }, _callee);
  }));
  return _createArtist.apply(this, arguments);
}

function getAllArtists(_x3, _x4) {
  return _getAllArtists.apply(this, arguments);
}

function _getAllArtists() {
  _getAllArtists = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
    }, _callee2);
  }));
  return _getAllArtists.apply(this, arguments);
}

function getByArtistId(_x5, _x6) {
  return _getByArtistId.apply(this, arguments);
}

function _getByArtistId() {
  _getByArtistId = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
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
    }, _callee3);
  }));
  return _getByArtistId.apply(this, arguments);
}

function updateArtist(_x7, _x8) {
  return _updateArtist.apply(this, arguments);
}

function _updateArtist() {
  _updateArtist = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var _validateBodyArtistUp, error, id, bodyAttributes;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
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
    }, _callee4);
  }));
  return _updateArtist.apply(this, arguments);
}

function deleteArtist(_x9, _x10) {
  return _deleteArtist.apply(this, arguments);
}

function _deleteArtist() {
  _deleteArtist = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
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
    }, _callee5);
  }));
  return _deleteArtist.apply(this, arguments);
}

function getArtistsByIdCategory(_x11, _x12) {
  return _getArtistsByIdCategory.apply(this, arguments);
}

function _getArtistsByIdCategory() {
  _getArtistsByIdCategory = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res) {
    var id_category;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
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
    }, _callee6);
  }));
  return _getArtistsByIdCategory.apply(this, arguments);
}