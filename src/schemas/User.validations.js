const Joi = require('@hapi/joi');

export function validateUserAuth(user) {
   const authUserSchema = Joi.object({
      user_password: Joi.string().max(8).min(7).required(),
      user_email: Joi.string().email().max(50).required()
   });
   return authUserSchema.validate(user);
}

export function validatePasswordChange(passwordObject) {
   const passwordSchema = Joi.object({
      actual_password: Joi.string().max(8).min(7).required(),
      new_password: Joi.string().max(8).min(7).required(),
      confirm_new_password: Joi.string().max(8).min(7).required()
   });
   return passwordSchema.validate(passwordObject);
}