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

export function validateEmail(userEmail) {
   const emailSchema = Joi.object({      
      user_email: Joi.string().email().max(50).required()
   });
   return emailSchema.validate(userEmail);
}

export function validateRecoveryPassword(requestBody) {
   const recoveryPasswordSchema = Joi.object({
      id_user: Joi.number().integer().positive().required(),
      recovery_token: Joi.string().required(),
      new_password: Joi.string().max(8).min(7).required(),
      confirm_new_password: Joi.string().max(8).min(7).required()
   });
   return recoveryPasswordSchema.validate(requestBody);
}

export function validateAdminCreation(requestBody) {
   const bodyCreationAdmin = Joi.object({
      fk_id_role: Joi.number().integer().positive().required(),
      fk_user_state: Joi.number().integer().positive().required(),
      user_email: Joi.string().email().required(),
      user_last_login: Joi.date().required(),
      user_password: Joi.string().required(),
      login_attempts: Joi.number().integer().required(),
      recovery_token: Joi.string(),
      recovery_token_expiration: Joi.date()
   });
   return bodyCreationAdmin.validate(requestBody);
}