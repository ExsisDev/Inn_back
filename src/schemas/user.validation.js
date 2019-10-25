const Joi = require('@hapi/joi');

export function validateBodyUserCreation (user) {
   const createUserSchema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      is_admin: Joi.boolean().required()
   });
   return createUserSchema.validate(user);
}

export function validateBodyUserUpdate (user) {
   const updateUserSchema = Joi.object({
      name: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email(),
      is_admin: Joi.boolean()
   });
   return updateUserSchema.validate(user);
}

export function validateUserAuth (user) {
   const authUserSchema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      is_admin: Joi.boolean().required()
   });
   return authUserSchema.validate(user);
}