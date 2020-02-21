"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserAuth = validateUserAuth;
exports.validatePasswordChange = validatePasswordChange;
exports.validateEmail = validateEmail;
exports.validateRecoveryPassword = validateRecoveryPassword;

var Joi = require('@hapi/joi');

function validateUserAuth(user) {
  var authUserSchema = Joi.object({
    user_password: Joi.string().max(8).min(7).required(),
    user_email: Joi.string().email().max(50).required()
  });
  return authUserSchema.validate(user);
}

function validatePasswordChange(passwordObject) {
  var passwordSchema = Joi.object({
    actual_password: Joi.string().max(8).min(7).required(),
    new_password: Joi.string().max(8).min(7).required(),
    confirm_new_password: Joi.string().max(8).min(7).required()
  });
  return passwordSchema.validate(passwordObject);
}

function validateEmail(userEmail) {
  var emailSchema = Joi.object({
    user_email: Joi.string().email().max(50).required()
  });
  return emailSchema.validate(userEmail);
}

function validateRecoveryPassword(requestBody) {
  var recoveryPasswordSchema = Joi.object({
    id_user: Joi.number().integer().positive().required(),
    recovery_token: Joi.string().required(),
    new_password: Joi.string().max(8).min(7).required(),
    confirm_new_password: Joi.string().max(8).min(7).required()
  });
  return recoveryPasswordSchema.validate(requestBody);
}