const Joi = require('@hapi/joi');
const { createResourceSchema } = require('./Resource.validations');

export function validateBodyAllyCreation(ally) {
   const createAllySchema = Joi.object({
      fk_id_role: Joi.number().required(),
      fk_user_state: Joi.number().required(),
      user_email: Joi.string().email().max(50).required(),
      user_password: Joi.string().max(8).required(),
      // user_last_login: Joi.date().required(),
      // login_attempts: Joi.number().required(),

      // fk_id_user: Joi.number().required(),
      ally_name: Joi.string().max(100).required(),
      ally_nit: Joi.number().required(),
      ally_web_page: Joi.string().max(200).required(),
      ally_phone: Joi.string().max(20).required(),
      ally_month_ideation_hours: Joi.number().integer().positive().required(),
      ally_month_experimentation_hours: Joi.number().integer().positive().required(),
      ally_resources: Joi.array().items(createResourceSchema),
      ally_categories: Joi.array().items(Joi.number().integer().positive())
   });
   return createAllySchema.validate(ally);
}

export function validateBodyAllyUpdate(ally) {
   const updateAllySchema = Joi.object({
      fk_id_role: Joi.number(),
      fk_user_state: Joi.number(),
      user_email: Joi.string().email().max(50),
      user_password: Joi.string().max(8),
      user_last_login: Joi.string(),
      login_attempts: Joi.number(),
      
      fk_id_user: Joi.number(),
      ally_name: Joi.string().max(100),
      ally_nit: Joi.number(),
      ally_web_page: Joi.string().max(200),
      ally_phone: Joi.string().max(20),
      ally_month_ideation_hours: Joi.number().integer().positive(),
      ally_month_experimentation_hours: Joi.number().integer().positive(),
      ally_resources: Joi.array().items(ResourceSchema)
   });
   return updateAllySchema.validate(ally);
}
