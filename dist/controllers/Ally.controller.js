"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlly = createAlly;
exports.updateAlly = updateAlly;

var _require = require('../schemas/Ally.validations'),
    validateBodyAllyCreation = _require.validateBodyAllyCreation,
    validateBodyAllyUpdate = _require.validateBodyAllyUpdate,
    validateAllyAuth = _require.validateAllyAuth;

var _require2 = require('../schemas/Resource.validations'),
    validateResourceCreation = _require2.validateResourceCreation,
    validateResourceUpdate = _require2.validateResourceUpdate;

var _ = require('lodash');

var _require3 = require('luxon'),
    DateTime = _require3.DateTime;

var bcrypt = require('bcrypt');

var sequelize = require('../utils/database');

var Ally = require('../models/Ally');

var User = require('../models/User');

var Resource = require('../models/Resource');

var AllyCategory = require('../models/AllyCategory');

var AlCategory = require('../models/AlCategory');
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
 * Crear aliado:
 * 1. verificando el body, 
 * 2. comprobando la no existencia del usuario,
 * 3. creando el aliado 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */


function createAlly(req, res) {
  var bodyAttributes, allyAttributes, userAttributes, resourcesAttributes, categories, userVerified, answer;
  return regeneratorRuntime.async(function createAlly$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          bodyAttributes = getValidParams(req, res, validateBodyAllyCreation);
          allyAttributes = _.pick(bodyAttributes, ['ally_name', 'ally_nit', 'ally_web_page', 'ally_phone', 'ally_month_ideation_hours', 'ally_month_experimentation_hours']);
          userAttributes = _.pick(bodyAttributes, ['fk_id_role', 'fk_user_state', 'user_email', 'user_password']);
          resourcesAttributes = _.pick(bodyAttributes, ['ally_resources']);
          categories = _.pick(bodyAttributes, ['ally_categories']);
          userAttributes['user_last_login'] = DateTime.local().setZone('America/Bogota').toString();
          userAttributes['login_attempts'] = 0;
          _context.prev = 7;
          _context.next = 10;
          return regeneratorRuntime.awrap(verifyUser(userAttributes.user_email));

        case 10:
          userVerified = _context.sent;

          if (!userVerified) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(400).send("El correo ya ha sido registrado"));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(hashPassword(userAttributes));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(createUserAndAlly(userAttributes, allyAttributes, resourcesAttributes, categories));

        case 17:
          answer = _context.sent;
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](7);
          return _context.abrupt("return", res.status(400).send(_context.t0));

        case 23:
          _context.prev = 23;
          return _context.abrupt("return", res.send(answer));

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 20, 23, 26]]);
}
/**
 * Verificar existencia del usuario por email
 * 
 * @param {String} user_email 
 */


function verifyUser(user_email) {
  return User.findOne({
    where: {
      user_email: user_email
    }
  }).then(function (result) {
    return result ? result : null;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Hashear la contraseña y almacenarla en userAttributes
 * 
 * @param {Object} userAttributes 
 */


function hashPassword(userAttributes) {
  return bcrypt.hash(userAttributes.user_password, 10).then(function (hash) {
    userAttributes.user_password = hash;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Crear el usuario, luego el aliado, continua creando los recursos asociados al aliado
 * y por ultimo crea las  categorias de interés del aliado.
 * Dentro de una transacción de Sequalize
 * 
 * @param {Object} userAttributes 
 * @param {Object} allyAttributes
 * @param {Object} resourcesAttributes es un objeto con un arreglo de Resources
 * @param {Object} categories es un objeto con un arreglo de enteros positivos
 */


function createUserAndAlly(userAttributes, allyAttributes, resourcesAttributes, categories) {
  var userCreated, allyCreated, resourcesCreated, categoriesCreated, obj1, obj2, obj3, obj4, answerObject;
  return regeneratorRuntime.async(function createUserAndAlly$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          resourcesCreated = [];
          categoriesCreated = [];
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(sequelize.transaction(function _callee(t) {
            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, resource, createResult, allyCategory, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, category, _createResult;

            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(User.create(userAttributes, {
                      transaction: t
                    }).then(function (result) {
                      allyAttributes['fk_id_user'] = result.id_user;
                      return result;
                    }));

                  case 2:
                    userCreated = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(Ally.create(allyAttributes, {
                      transaction: t
                    }).then(function (result) {
                      return result;
                    }));

                  case 5:
                    allyCreated = _context2.sent;
                    //step 3
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context2.prev = 9;
                    _iterator = resourcesAttributes['ally_resources'][Symbol.iterator]();

                  case 11:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context2.next = 21;
                      break;
                    }

                    resource = _step.value;
                    resource['fk_id_ally'] = allyCreated.id_ally;
                    _context2.next = 16;
                    return regeneratorRuntime.awrap(Resource.create(resource, {
                      transaction: t
                    }).then(function (result) {
                      return result;
                    }));

                  case 16:
                    createResult = _context2.sent;
                    resourcesCreated.push(_.omit(createResult.dataValues, ['fk_id_ally', 'updated_at', 'created_at']));

                  case 18:
                    _iteratorNormalCompletion = true;
                    _context2.next = 11;
                    break;

                  case 21:
                    _context2.next = 27;
                    break;

                  case 23:
                    _context2.prev = 23;
                    _context2.t0 = _context2["catch"](9);
                    _didIteratorError = true;
                    _iteratorError = _context2.t0;

                  case 27:
                    _context2.prev = 27;
                    _context2.prev = 28;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 30:
                    _context2.prev = 30;

                    if (!_didIteratorError) {
                      _context2.next = 33;
                      break;
                    }

                    throw _iteratorError;

                  case 33:
                    return _context2.finish(30);

                  case 34:
                    return _context2.finish(27);

                  case 35:
                    //step 4
                    allyCategory = {};
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context2.prev = 39;
                    _iterator2 = categories['ally_categories'][Symbol.iterator]();

                  case 41:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                      _context2.next = 51;
                      break;
                    }

                    category = _step2.value;
                    allyCategory = {
                      fk_id_ally: allyCreated.id_ally,
                      fk_id_category: category
                    };
                    _context2.next = 46;
                    return regeneratorRuntime.awrap(AllyCategory.create(allyCategory, {
                      transaction: t
                    }).then(function (result) {
                      return result;
                    }));

                  case 46:
                    _createResult = _context2.sent;
                    categoriesCreated.push(_.omit(_createResult.dataValues, ['fk_id_ally', 'updated_at', 'created_at']));

                  case 48:
                    _iteratorNormalCompletion2 = true;
                    _context2.next = 41;
                    break;

                  case 51:
                    _context2.next = 57;
                    break;

                  case 53:
                    _context2.prev = 53;
                    _context2.t1 = _context2["catch"](39);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context2.t1;

                  case 57:
                    _context2.prev = 57;
                    _context2.prev = 58;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                      _iterator2["return"]();
                    }

                  case 60:
                    _context2.prev = 60;

                    if (!_didIteratorError2) {
                      _context2.next = 63;
                      break;
                    }

                    throw _iteratorError2;

                  case 63:
                    return _context2.finish(60);

                  case 64:
                    return _context2.finish(57);

                  case 65:
                  case "end":
                    return _context2.stop();
                }
              }
            }, null, null, [[9, 23, 27, 35], [28,, 30, 34], [39, 53, 57, 65], [58,, 60, 64]]);
          }));

        case 5:
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](2);
          throw _context3.t0;

        case 10:
          _context3.prev = 10;

          if (!(userCreated && allyCreated)) {
            _context3.next = 20;
            break;
          }

          obj1 = _.omit(userCreated.dataValues, ['user_password']);
          obj2 = _.omit(allyCreated.dataValues, ['fk_id_user']);
          obj3 = {
            ally_resources: []
          };
          obj4 = {
            ally_categories: []
          };

          if (resourcesCreated) {
            obj3['ally_resources'] = _.assign(resourcesCreated);
          }

          if (categoriesCreated) {
            obj4['ally_categories'] = _.assign(categoriesCreated);
          }

          answerObject = _.assign(obj1, obj2, obj3, obj4);
          return _context3.abrupt("return", answerObject);

        case 20:
          return _context3.finish(10);

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 7, 10, 21]]);
}
/**
 * Actualizar horas de ideación, experimentación y
 * categorias de especialidad del aliado.
 * 1. Se eliminan registros previos en AllyCategories asociados al aliado
 * 2. Se crean los nuevos registros en AllyCategories
 * 3. Se actualizan las horas del aliado
 * @param {*} req 
 * @param {*} res 
 */


function updateAlly(req, res) {
  var isThereHours, isThereCategories, answer, id_ally, bodyAttributes, newHours, newCategories;
  return regeneratorRuntime.async(function updateAlly$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          answer = {
            status: null,
            data: null
          };
          id_ally = parseInt(req.params.idAlly);

          if (!(!Number.isInteger(id_ally) || id_ally <= 0)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo"));

        case 4:
          bodyAttributes = getValidParams(req, res, validateBodyAllyUpdate);
          newHours = _.pick(bodyAttributes, ['ally_month_ideation_hours', 'ally_month_experimentation_hours']);
          newCategories = _.pick(bodyAttributes, ['ally_categories']);
          isThereCategories = !_.isEmpty(newCategories);
          isThereHours = !_.isEmpty(newHours);

          if (!(!isThereHours && !isThereCategories)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(400).send("Debe haber almenos un campo para actualizar."));

        case 11:
          _context5.prev = 11;
          _context5.next = 14;
          return regeneratorRuntime.awrap(sequelize.transaction(function _callee2(t) {
            var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, newCategory, aux;

            return regeneratorRuntime.async(function _callee2$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!isThereCategories) {
                      _context4.next = 30;
                      break;
                    }

                    _context4.next = 3;
                    return regeneratorRuntime.awrap(AllyCategory.destroy({
                      where: {
                        fk_id_ally: id_ally
                      }
                    }, {
                      transaction: t
                    }));

                  case 3:
                    // Step 2
                    _iteratorNormalCompletion3 = true;
                    _didIteratorError3 = false;
                    _iteratorError3 = undefined;
                    _context4.prev = 6;
                    _iterator3 = newCategories['ally_categories'][Symbol.iterator]();

                  case 8:
                    if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                      _context4.next = 16;
                      break;
                    }

                    newCategory = _step3.value;
                    aux = {
                      fk_id_ally: id_ally,
                      fk_id_category: newCategory
                    };
                    _context4.next = 13;
                    return regeneratorRuntime.awrap(AllyCategory.create(aux, {
                      transaction: t
                    }));

                  case 13:
                    _iteratorNormalCompletion3 = true;
                    _context4.next = 8;
                    break;

                  case 16:
                    _context4.next = 22;
                    break;

                  case 18:
                    _context4.prev = 18;
                    _context4.t0 = _context4["catch"](6);
                    _didIteratorError3 = true;
                    _iteratorError3 = _context4.t0;

                  case 22:
                    _context4.prev = 22;
                    _context4.prev = 23;

                    if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                      _iterator3["return"]();
                    }

                  case 25:
                    _context4.prev = 25;

                    if (!_didIteratorError3) {
                      _context4.next = 28;
                      break;
                    }

                    throw _iteratorError3;

                  case 28:
                    return _context4.finish(25);

                  case 29:
                    return _context4.finish(22);

                  case 30:
                    if (!isThereHours) {
                      _context4.next = 33;
                      break;
                    }

                    _context4.next = 33;
                    return regeneratorRuntime.awrap(Ally.update(newHours, {
                      where: {
                        id_ally: id_ally
                      }
                    }));

                  case 33:
                  case "end":
                    return _context4.stop();
                }
              }
            }, null, null, [[6, 18, 22, 30], [23,, 25, 29]]);
          }));

        case 14:
          _context5.next = 16;
          return regeneratorRuntime.awrap(getAllyInfo(id_ally));

        case 16:
          answer.data = _context5.sent;
          answer.status = 200;
          _context5.next = 25;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](11);
          console.log(_context5.t0);
          answer.data = "Algo salió mal. Mira los logs para mayor información";
          answer.status = 500;

        case 25:
          return _context5.abrupt("return", res.status(answer.status).send(answer.data));

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[11, 20]]);
}
/**
 * Obtener la información del aliado con sus respectivas categorías.
 * @param {Number} id_ally - Un entero que representa el id del aliado
 * @returns {Promise} - Promesa
 */


function getAllyInfo(id_ally) {
  return Ally.findOne({
    where: {
      id_ally: id_ally
    },
    include: [{
      model: AllyCategory,
      include: [{
        model: AlCategory,
        attributes: ['id_category', 'category_name']
      }]
    }],
    attributes: ['id_ally', 'ally_name', 'ally_nit', 'ally_web_page', 'ally_phone', 'ally_month_ideation_hours', 'ally_month_experimentation_hours']
  }).then(function (result) {
    var categories = [];
    result.dataValues['ally_categories'].map(function (category) {
      categories.push(category.al_category);
    });
    result.dataValues.ally_categories = categories;
    return result.dataValues;
  })["catch"](function (error) {
    console.log(error);
  });
}