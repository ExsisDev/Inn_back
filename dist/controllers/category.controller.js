"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.getByCategoryId = getByCategoryId;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategoriesByIdArtist = getCategoriesByIdArtist;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../schemas/category.validation'),
    validateBodyCategoryCreation = _require.validateBodyCategoryCreation,
    validateBodyCategoryUpdate = _require.validateBodyCategoryUpdate;

var Category = require('../models/Category');

var Artist_Category = require('../models/Artist_Category');

function createCategory(_x, _x2) {
  return _createCategory.apply(this, arguments);
}

function _createCategory() {
  _createCategory = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _validateBodyCategory, error, categoryAttributes;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //Validación del body
            _validateBodyCategory = validateBodyCategoryCreation(req.body), error = _validateBodyCategory.error;

            if (!error) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(400).send(error.details[0].message));

          case 3:
            //Cración del artista
            categoryAttributes = req.body;
            return _context.abrupt("return", Category.create(categoryAttributes, {
              fields: ['category_name', 'details']
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
  return _createCategory.apply(this, arguments);
}

function getAllCategories(_x3, _x4) {
  return _getAllCategories.apply(this, arguments);
}

function _getAllCategories() {
  _getAllCategories = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Category.findAll({
              order: ['id_category']
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
  return _getAllCategories.apply(this, arguments);
}

function getByCategoryId(_x5, _x6) {
  return _getByCategoryId.apply(this, arguments);
}

function _getByCategoryId() {
  _getByCategoryId = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            //Obtener el elemento
            id = req.params.id;
            return _context3.abrupt("return", Category.findOne({
              where: {
                id_category: id
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
  return _getByCategoryId.apply(this, arguments);
}

function updateCategory(_x7, _x8) {
  return _updateCategory.apply(this, arguments);
}

function _updateCategory() {
  _updateCategory = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var _validateBodyCategory2, error, id, bodyAttributes;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            //Validación del body
            _validateBodyCategory2 = validateBodyCategoryUpdate(req.body), error = _validateBodyCategory2.error;

            if (!error) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", res.status(400).send(error.details[0].message));

          case 3:
            //Actualización de la categorìa
            id = req.params.id;
            bodyAttributes = req.body;
            Category.findByPk(id).then(function (result) {
              if (!result) res.status(404).send("No existe el elemento con id ".concat(id));
              return result.update(bodyAttributes).then(function (updated) {
                res.status(200).send(updated);
              })["catch"](function (error) {
                res.status(500).send(error);
              });
            })["catch"](function (error) {
              res.status(500).send(error);
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _updateCategory.apply(this, arguments);
}

function deleteCategory(_x9, _x10) {
  return _deleteCategory.apply(this, arguments);
}

function _deleteCategory() {
  _deleteCategory = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            Category.findByPk(id).then(function (result) {
              if (!result) res.status(404).send("No existe el elemento con id ".concat(id));
              return Category.destroy({
                where: {
                  id_category: id
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
  return _deleteCategory.apply(this, arguments);
}

function getCategoriesByIdArtist(_x11, _x12) {
  return _getCategoriesByIdArtist.apply(this, arguments);
}

function _getCategoriesByIdArtist() {
  _getCategoriesByIdArtist = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res) {
    var id_artist;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id_artist = req.params.id_artist;
            return _context6.abrupt("return", Category.findAll({
              include: [{
                model: Artist_Category,
                where: {
                  fk_id_artist: id_artist
                },
                attributes: []
              }]
            }).then(function (result) {
              result.length > 0 ? res.status(200).send(result) : res.status(404).send("No existe el elemento con id ".concat(id));
            })["catch"](function (error) {
              res.status(404).send("No existe el elemento con id ".concat(id_artist));
            }));

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getCategoriesByIdArtist.apply(this, arguments);
}