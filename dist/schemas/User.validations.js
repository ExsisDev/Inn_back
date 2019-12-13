"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserAuth = validateUserAuth;
exports.validatePasswordChange = validatePasswordChange;

var Joi = require('@hapi/joi');

function validateUserAuth(user) {
  var authUserSchema = Joi.object({
    user_password: Joi.string().max(8).required(),
    user_email: Joi.string().email().max(50).required()
  });
  return authUserSchema.validate(user);
}

function validatePasswordChange(passwordObject) {
  var passwordSchema = Joi.object({
    actual_password: Joi.string().max(8).required(),
    new_password: Joi.string().max(8).required(),
    confirm_new_password: Joi.string().max(8).required()
  });
  return passwordSchema.validate(passwordObject);
}