const express = require('express');
const router = express.Router();
const {validateCourse} = require('../schemas/validationSchemas');


const courses = [
   { id: 1, name: 'course1' },
   { id: 2, name: 'course2' },
   { id: 3, name: 'course3' },
];


router.get('/', (req, res) => {
   res.send(courses);
});


router.get('/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("No se encontró el elemento");
   res.send(course);
});


router.get('/:year/:month', (req, res) => {
   res.send(req.query);
});


router.post('/', (req, res) => {
   //Validación del body
   const {error} = validateCourse(req.body);
   if (error) return res.status(400).send(result.error.details[0].message);

   //Cración del curso
   const course = {
      id: courses.length + 1,
      name: req.body.name
   };

   courses.push(course); 
   res.send(course);
});


router.put('/:id', (req, res) => {
   //Búsqueda del id
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("No se encontró el elemento");

   //Validación del body
   const {error} = validateCourse(req.body); //Destructuring res.error
   if (error) return res.status(400).send(result.error.details[0].message);

   //Actualización del elemento
   course.name = req.params.name;
   res.send(course);
});


router.delete('/:id', (req, res) => {
   //Búsqueda del id
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("No se encontró el elemento");

   //Borrar el elemento
   const index = courses.indexOf(course);
   courses.splice(index, 1);
   res.send(course);
});

module.exports = router;