const Joi = require('@hapi/joi');

export function validateBodySurveyCreation(survey) {
   const createSurveySchema = Joi.object({
      survey_date: Joi.date().required(),
      user_id_creator: Joi.number().required(),
   });
   return createSurveySchema.validate(survey);
}

export function validateBodySurveyUpdate(survey) {
   const updateSurveySchema = Joi.object({
      survey_date: Joi.date(),
      user_id_creator: Joi.number(),
   });
   return updateSurveySchema.validate(survey);
}