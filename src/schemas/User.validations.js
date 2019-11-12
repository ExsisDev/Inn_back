const Joi = require('@hapi/joi');

export function validateUserAuth(user) {
   const authUserSchema = Joi.object({
      user_password: Joi.string().max(8).required(),
      user_email: Joi.string().email().max(50).required()
   });
   return authUserSchema.validate(user);
}