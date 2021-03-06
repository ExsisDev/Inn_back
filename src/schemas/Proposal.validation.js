const Joi = require('@hapi/joi');

export function validateBodyProposalCreation(proposal) {
   const createProposalSchema = Joi.object({
      fk_id_challenge: Joi.number().required(),
      fk_id_ally: Joi.number().required(),
      fk_id_proposal_state: Joi.number().required(),
      ideation_hours: Joi.number().required(),
      experimentation_hours: Joi.number().required(),
      solution_description: Joi.string().required(),
      proposal_resources: Joi.string().required()
   });
   return createProposalSchema.validate(proposal);
}


export function validateBodyProposalUpdate(proposal) {
   const updateProposalSchema = Joi.object({
      fk_id_challenge: Joi.number(),
      fk_id_ally: Joi.number(),
      fk_id_proposal_state: Joi.number(),
      ideation_hours: Joi.number(),
      experimentation_hours: Joi.number(),
      solution_description: Joi.string(),
      proposal_resources: Joi.string()
   });
   return updateProposalSchema.validate(proposal);
}