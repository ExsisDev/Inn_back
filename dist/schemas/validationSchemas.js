"use strict";

var Joi = require('@hapi/joi');

var modelValidations = {
  validateCourse: function validateCourse(course) {
    var courseSchema = Joi.object({
      name: Joi.string().min(3).required()
    });
    return courseSchema.validate(course);
  }
};
module.exports = modelValidations;