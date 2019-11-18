const Joi = require('@hapi/joi');

export function validateBodyAllyCreation(ally) {
   const createAllySchema = Joi.object({
      fk_id_role: Joi.number().required(),
      fk_user_state: Joi.number().required(),
      user_email: Joi.string().email().max(50).required(),
      user_password: Joi.string().max(8).required(),
      user_last_login: Joi.date().required(),
      login_attempts: Joi.number().required(),
      hour_until_access: Joi.date().required(),

      // fk_id_user: Joi.number().required(),
      ally_name: Joi.string().max(100).required(),
      ally_nit: Joi.number().required(),
      ally_web_page: Joi.string().max(200).required(),
      ally_phone: Joi.string().max(20).required(),
      ally_month_ideation_hours: Joi.number().required(),
      ally_month_experimentation_hours: Joi.number().required()
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
      hour_until_access: Joi.date(),
      
      fk_id_user: Joi.number(),
      ally_name: Joi.string().max(100),
      ally_nit: Joi.number(),
      ally_web_page: Joi.string().max(200),
      ally_phone: Joi.string().max(20),
      ally_month_ideation_hours: Joi.number(),
      ally_month_experimentation_hours: Joi.number()
   });
   return updateAllySchema.validate(ally);
}
