const Joi = require('@hapi/joi');

export function validateBodyCategoryCreation(category) {
   const createCategorychema = Joi.object({
      category_name: Joi.string().required(),
      details: Joi.string().required(),
   });
   return createCategorychema.validate(category);
}

export function validateBodyCategoryUpdate(category) {
   const updateCategorychema = Joi.object({
      category_name: Joi.string(),
      details: Joi.string(),
   });
   return updateCategorychema.validate(category);
}