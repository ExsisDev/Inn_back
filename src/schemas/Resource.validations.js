const Joi = require('@hapi/joi');

export function validateBodyResourceCreation(resource) {
   const createResourceSchema = Joi.object({
       id_resource: Joi.number().integer().positive().required(),
       resource_name: Joi.string().max(50).required(),
       resource_profile: Joi.string().max(200).required(),
       resource_experience: Joi.string().required(),
       fk_id_ally: Joi.number().integer().positive().required()
   });
   return createResourceSchema.validate(resource);
}

export function validateBodyResourceUpdate(resource) {
   const updateResourceSchema = Joi.object({
      id_resource: Joi.number().integer().positive(),
      resource_name: Joi.string().max(50),
      resource_profile: Joi.string().max(200),
      resource_experience: Joi.string(),
   });
   return updateResourceSchema.validate(resource);
}