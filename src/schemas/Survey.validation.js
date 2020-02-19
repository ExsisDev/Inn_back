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

export function validateBodyAnswers(answers) {
   const updateSurveyQuestionSchema = Joi.array().items(answerSchema).required();
   return updateSurveyQuestionSchema.validate(answers);
}
const answerSchema = Joi.object({
   fk_id_survey: Joi.number().integer().positive().required(),
   fk_id_question: Joi.number().integer().positive().required(),
   answer: Joi.string().required()
});