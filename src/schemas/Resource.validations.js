const Joi = require('@hapi/joi');

export const createResourceSchema = Joi.object({
   resource_name: Joi.string().max(50).required(),
   resource_profile: Joi.string().max(200).required(),
   resource_experience: Joi.string().required()
});

export const updateResourceSchema = Joi.object({
   id_resource: Joi.number().integer().positive().required(),
   resource_name: Joi.string().max(50).required(),
   resource_profile: Joi.string().max(200).required(),
   resource_experience: Joi.string().required()
});

export function validateResource(resource) {
   return(updateResourceSchema.validate(resource));
}
