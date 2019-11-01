const Joi = require('@hapi/joi');

export function validateBodySurveyCreation (survey) {
   const createSurveySchema = Joi.object({
      survey_date: Joi.date().required(),
      user_id: Joi.integer().required()
   });
   return createSurveySchema.validate(survey);
}

export function validateBodySurveyUpdate (survey) {
   const updateSurveySchema = Joi.object({
      survey_date: Joi.date(),
      user_id: Joi.integer()
   });
   return updateSurveySchema.validate(survey);
}
