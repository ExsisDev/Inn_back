const Joi = require('@hapi/joi');

export function validateCourse(course) {
   const courseSchema = Joi.object({
      name: Joi.string().min(3).required()
   });
   return courseSchema.validate(course);
}

export function validateArtist(artist) {
   const artistSchema = Joi.object({
      full_name: Joi.string().required(),
      email: Joi.string().required(),
      address: Joi.string().required(),
      phone_number: Joi.number().required(),
      start_date: Joi.date().required(),
      birth_date: Joi.date().required()
   });
   return artistSchema.validate(artist);
}


