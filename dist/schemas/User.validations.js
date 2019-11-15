"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserAuth = validateUserAuth;

var Joi = require('@hapi/joi');

function validateUserAuth(user) {
  var authUserSchema = Joi.object({
    user_password: Joi.string().max(8).required(),
    user_email: Joi.string().email().max(50).required()
  });
  return authUserSchema.validate(user);
}