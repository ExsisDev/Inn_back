"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodyUserCreation = validateBodyUserCreation;
exports.validateBodyUserUpdate = validateBodyUserUpdate;
exports.validateUserAuth = validateUserAuth;

var Joi = require('@hapi/joi');

function validateBodyUserCreation(user) {
  var createUserSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    is_admin: Joi["boolean"]().required()
  });
  return createUserSchema.validate(user);
}

function validateBodyUserUpdate(user) {
  var updateUserSchema = Joi.object({
    name: Joi.string(),
    password: Joi.string(),
    email: Joi.string().email(),
    is_admin: Joi["boolean"]()
  });
  return updateUserSchema.validate(user);
}

function validateUserAuth(user) {
  var authUserSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    is_admin: Joi["boolean"]().required()
  });
  return authUserSchema.validate(user);
}