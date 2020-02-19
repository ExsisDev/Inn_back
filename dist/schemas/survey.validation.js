"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodySurveyCreation = validateBodySurveyCreation;
exports.validateBodySurveyUpdate = validateBodySurveyUpdate;
exports.validateBodyAnswers = validateBodyAnswers;

var Joi = require('@hapi/joi');

function validateBodySurveyCreation(survey) {
  var createSurveySchema = Joi.object({
    survey_date: Joi.date().required(),
    user_id_creator: Joi.number().required()
  });
  return createSurveySchema.validate(survey);
}

function validateBodySurveyUpdate(survey) {
  var updateSurveySchema = Joi.object({
    survey_date: Joi.date(),
    user_id_creator: Joi.number()
  });
  return updateSurveySchema.validate(survey);
}

function validateBodyAnswers(answers) {
  var updateSurveyQuestionSchema = Joi.array().items(answerSchema).required();
  return updateSurveyQuestionSchema.validate(answers);
}

var answerSchema = Joi.object({
  fk_id_survey: Joi.number().integer().positive().required(),
  fk_id_question: Joi.number().integer().positive().required(),
  answer: Joi.string().required()
});