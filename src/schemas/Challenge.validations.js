const Joi = require('@hapi/joi');

export function validateBodyChallengeCreation(challenge) {
   const createChallengeSchema = Joi.object({
      fk_id_challenge_state: Joi.number().required(),
      fk_id_survey: Joi.number().required(),
      fk_id_company: Joi.number().required(),
      challenge_name: Joi.string().max(200).required(),
      challenge_description: Joi.string().required(),
      close_date: Joi.date().required()
   });
   return createChallengeSchema.validate(challenge);
}


export function validateBodyChallengeUpdate(challenge) {
   const updateChallengeSchema = Joi.object({
      fk_id_challenge_state: Joi.number(),
      fk_id_survey: Joi.number(),
      fk_id_company: Joi.number(),
      challenge_name: Joi.string().max(200),
      challenge_description: Joi.string(),
      close_date: Joi.date()
   });
   return updateChallengeSchema.validate(challenge);
}