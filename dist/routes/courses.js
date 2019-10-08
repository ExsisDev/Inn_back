"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../schemas/validationSchemas'),
    validateCourse = _require.validateCourse;

var courses = [{
  id: 1,
  name: 'course1'
}, {
  id: 2,
  name: 'course2'
}, {
  id: 3,
  name: 'course3'
}];
router.get('/', function (req, res) {
  res.send(courses);
});
router.get('/:id', function (req, res) {
  var course = courses.find(function (c) {
    return c.id === parseInt(req.params.id);
  });
  if (!course) return res.status(404).send("No se encontró el elemento");
  res.send(course);
});
router.get('/:year/:month', function (req, res) {
  res.send(req.query);
});
router.post('/', function (req, res) {
  //Validación del body
  var _schemasValidation$va = schemasValidation.validateCourse(req.body),
      error = _schemasValidation$va.error;

  if (error) return res.status(400).send(result.error.details[0].message); //Cración del curso

  var course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});
router.put('/:id', function (req, res) {
  //Búsqueda del id
  var course = courses.find(function (c) {
    return c.id === parseInt(req.params.id);
  });
  if (!course) return res.status(404).send("No se encontró el elemento"); //Validación del body

  var _schemasValidation$va2 = schemasValidation.validateCourse(req.body),
      error = _schemasValidation$va2.error; //Destructuring result.error


  if (error) return res.status(400).send(result.error.details[0].message); //Actualización del elemento

  course.name = req.params.name;
  res.send(course);
});
router["delete"]('/:id', function (req, res) {
  //Búsqueda del id
  var course = courses.find(function (c) {
    return c.id === parseInt(req.params.id);
  });
  if (!course) return res.status(404).send("No se encontró el elemento"); //Borrar el elemento

  var index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});
module.exports = router;