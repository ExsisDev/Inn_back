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
    actual_password: Joi.string().max(10).min(8).required().error(function (errors) {
      errors.forEach(function (err) {
        switch (err.type) {
          case "any.empty":
            err.message = "Debes introducir una contraseña";
            break;

          case "string.min":
            err.message = "La contrase\xF1a no puede contener menos de ".concat(err.context.limit);
            break;

          case "string.max":
            err.message = "La contrase\xF1a no puede contener m\xE1s de ".concat(err.context.limit);
            break;

          default:
            break;
        }
      });
      return errors;
    }),
    new_password: Joi.string().max(10).min(8).required().error(function (errors) {
      errors.forEach(function (err) {
        switch (err.type) {
          case "any.empty":
            err.message = "Debes introducir una contraseña";
            break;

          case "string.min":
            err.message = "La contrase\xF1a no puede contener menos de ".concat(err.context.limit);
            break;

          case "string.max":
            err.message = "La contrase\xF1a no puede contener m\xE1s de ".concat(err.context.limit);
            break;

          default:
            break;
        }
      });
      return errors;
    }),
    confirm_new_password: Joi.string().max(10).min(8).required().error(function (errors) {
      errors.forEach(function (err) {
        switch (err.type) {
          case "any.empty":
            err.message = "Debes introducir una contraseña";
            break;

          case "string.min":
            err.message = "La contrase\xF1a no puede contener menos de ".concat(err.context.limit);
            break;

          case "string.max":
            err.message = "La contrase\xF1a no puede contener m\xE1s de ".concat(err.context.limit);
            break;

          default:
            break;
        }
      });
      return errors;
    })
  });
  return passwordSchema.validate(passwordObject);
}