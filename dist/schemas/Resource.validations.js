"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateResource = validateResource;
exports.updateResourceSchema = exports.createResourceSchema = void 0;

var Joi = require('@hapi/joi');

var createResourceSchema = Joi.object({
  resource_name: Joi.string().max(50).required(),
  resource_profile: Joi.string().max(200).required(),
  resource_experience: Joi.string().required()
});
exports.createResourceSchema = createResourceSchema;
var updateResourceSchema = Joi.object({
  id_resource: Joi.number().integer().positive().required(),
  resource_name: Joi.string().max(50).required(),
  resource_profile: Joi.string().max(200).required(),
  resource_experience: Joi.string().required()
});
exports.updateResourceSchema = updateResourceSchema;

function validateResource(resource) {
  return updateResourceSchema.validate(resource);
}