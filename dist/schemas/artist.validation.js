"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBodyArtistCreation = validateBodyArtistCreation;
exports.validateBodyArtistUpdate = validateBodyArtistUpdate;

var Joi = require('@hapi/joi');

function validateBodyArtistCreation(artist) {
  var createArtistSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    phone_number: Joi.number().required(),
    start_date: Joi.date().required(),
    birth_date: Joi.date().required()
  });
  return createArtistSchema.validate(artist);
}

function validateBodyArtistUpdate(artist) {
  var updateArtistSchema = Joi.object({
    full_name: Joi.string(),
    email: Joi.string(),
    address: Joi.string(),
    phone_number: Joi.number(),
    start_date: Joi.date(),
    birth_date: Joi.date()
  });
  return updateArtistSchema.validate(artist);
}