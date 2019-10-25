"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodyCategoryCreation = validateBodyCategoryCreation;
exports.validateBodyCategoryUpdate = validateBodyCategoryUpdate;

var Joi = require('@hapi/joi');

function validateBodyCategoryCreation(category) {
  var createCategorychema = Joi.object({
    category_name: Joi.string().required(),
    details: Joi.string().required()
  });
  return createCategorychema.validate(category);
}

function validateBodyCategoryUpdate(category) {
  var updateCategorychema = Joi.object({
    category_name: Joi.string(),
    details: Joi.string()
  });
  return updateCategorychema.validate(category);
}