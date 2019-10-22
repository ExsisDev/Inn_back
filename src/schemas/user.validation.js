const Joi = require('@hapi/joi');

export function validateBodyUserCreation (user) {
   const createUserSchema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required()
   });
   return createUserSchema.validate(user);
}

export function validateBodyUserUpdate (user) {
   const updateUserSchema = Joi.object({
      name: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email()
   });
   return updateUserSchema.validate(user);
}

export function validateUserAuth (user) {
   const authUserSchema = Joi.object({
      password: Joi.string(),
      email: Joi.string().email()
   });
   return authUserSchema.validate(user);
}