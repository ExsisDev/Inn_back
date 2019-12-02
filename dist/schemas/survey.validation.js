"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodySurveyCreation = validateBodySurveyCreation;
exports.validateBodySurveyUpdate = validateBodySurveyUpdate;

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