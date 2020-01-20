"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodyProposalCreation = validateBodyProposalCreation;
exports.validateBodyProposalUpdate = validateBodyProposalUpdate;

var Joi = require('@hapi/joi');

function validateBodyProposalCreation(proposal) {
  var createProposalSchema = Joi.object({
    fk_id_challenge: Joi.number().required(),
    fk_id_ally: Joi.number().required(),
    fk_id_proposal_state: Joi.number().required(),
    ideation_hours: Joi.number().required(),
    experimentation_hours: Joi.number().required(),
    solution_description: Joi.string().required(),
    proposal_is_assigned: Joi["boolean"]().required()
  });
  return createProposalSchema.validate(proposal);
}

function validateBodyProposalUpdate(proposal) {
  var updateProposalSchema = Joi.object({
    fk_id_challenge: Joi.number(),
    fk_id_ally: Joi.number(),
    fk_id_proposal_state: Joi.number(),
    ideation_hours: Joi.number(),
    experimentation_hours: Joi.number(),
    solution_description: Joi.string(),
    proposal_is_assigned: Joi["boolean"]()
  });
  return updateProposalSchema.validate(proposal);
}