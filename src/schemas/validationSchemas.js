const Joi = require('@hapi/joi');

const modelValidations = {
   validateCourse : (course) => {
      const courseSchema = Joi.object({
         name: Joi.string().min(3).required()
      });
      return courseSchema.validate(course);
   }
}

module.exports = modelValidations;