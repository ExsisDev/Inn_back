const Joi = require('@hapi/joi');

export function validateBodyNoteCreation(note) {
   const createNoteSchema = Joi.object({
      fk_id_challenge: Joi.number().required(),
      note_header: Joi.string().required(),
      note_content: Joi.string().required()
   });
   return createNoteSchema.validate(note);
}


export function validateBodyNoteUpdate(note) {
   const updateNoteSchema = Joi.object({
      fk_id_challenge: Joi.number(),
      note_header: Joi.string(),
      note_content: Joi.string()
   });
   return updateNoteSchema.validate(note);
}