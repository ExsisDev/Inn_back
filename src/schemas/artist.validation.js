const Joi = require('@hapi/joi');

export function validateBodyArtistCreation(artist) {
   const createArtistSchema = Joi.object({
      full_name: Joi.string().required(),
      email: Joi.string().required(),
      address: Joi.string().required(),
      phone_number: Joi.number().required(),
      start_date: Joi.date().required(),
      birth_date: Joi.date().required()
   });
   return createArtistSchema.validate(artist);
}

export function validateBodyArtistUpdate(artist) {
   const updateArtistSchema = Joi.object({
      full_name: Joi.string(),
      email: Joi.string(),
      address: Joi.string(),
      phone_number: Joi.number(),
      start_date: Joi.date(),
      birth_date: Joi.date()
   });
   return updateArtistSchema.validate(artist);
}