"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodyChallengeCreation = validateBodyChallengeCreation;
exports.validateBodyChallengeUpdate = validateBodyChallengeUpdate;

var Joi = require('@hapi/joi');

function validateBodyChallengeCreation(challenge) {
  var createChallengeSchema = Joi.object({
    fk_id_challenge_state: Joi.number().required(),
    fk_id_survey: Joi.number().required(),
    fk_id_company: Joi.number().required(),
    challenge_name: Joi.string().max(200).required(),
    challenge_description: Joi.string().required()
  });
  return createChallengeSchema.validate(challenge);
}

function validateBodyChallengeUpdate(challenge) {
  var updateChallengeSchema = Joi.object({
    fk_id_challenge_state: Joi.number(),
    fk_id_survey: Joi.number(),
    fk_id_company: Joi.number(),
    challenge_name: Joi.string().max(200),
    challenge_description: Joi.string()
  });
  return updateChallengeSchema.validate(challenge);
}