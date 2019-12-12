const Joi = require('@hapi/joi');

export const createResourceSchema = Joi.object({
   resource_name: Joi.string().max(50).required(),
   resource_profile: Joi.string().max(200).required(),
   resource_experience: Joi.string().required()
});

export const updateResourceSchema = Joi.object({
   resource_name: Joi.string().max(50),
   resource_profile: Joi.string().max(200),
   resource_experience: Joi.string(),
});
