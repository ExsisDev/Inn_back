"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodyNoteCreation = validateBodyNoteCreation;
exports.validateBodyNoteUpdate = validateBodyNoteUpdate;

var Joi = require('@hapi/joi');

function validateBodyNoteCreation(note) {
  var createNoteSchema = Joi.object({
    fk_id_challenge: Joi.number().required(),
    note_header: Joi.string().required(),
    note_content: Joi.string().required()
  });
  return createNoteSchema.validate(note);
}

function validateBodyNoteUpdate(note) {
  var updateNoteSchema = Joi.object({
    fk_id_challenge: Joi.number(),
    note_header: Joi.string(),
    note_content: Joi.string()
  });
  return updateNoteSchema.validate(note);
}