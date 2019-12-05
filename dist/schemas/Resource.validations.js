"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateResourceUpdate = validateResourceUpdate;
exports.createResourceSchema = void 0;

var Joi = require('@hapi/joi');

var createResourceSchema = Joi.object({
  resource_name: Joi.string().max(50).required(),
  resource_profile: Joi.string().max(200).required(),
  resource_experience: Joi.string().required()
});
exports.createResourceSchema = createResourceSchema;

function validateResourceUpdate(resource) {
  var updateResourceSchema = Joi.object({
    resource_name: Joi.string().max(50),
    resource_profile: Joi.string().max(200),
    resource_experience: Joi.string()
  });
  return updateResourceSchema.validate(resource);
}