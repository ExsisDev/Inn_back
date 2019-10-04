const express = require('express');
const schemasValidation = require('./schemas');
const {logging, authenticating} = require('./logger.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //POST http://localhost:3000/api/courses (key=value&key=value)
app.use(express.static('public')); //Archivos públicos

app.use(logging);
app.use(authenticating);


const courses = [
   { id: 1, name: 'course1' },
   { id: 2, name: 'course2' },
   { id: 3, name: 'course3' },
];


app.get('/', (req, res) => {
   res.send('Hello world');
});


app.get('/api/courses', (req, res) => {
   res.send(courses);
});


app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("No se encontró el elemento");
   res.send(course);
});


app.get('/api/posts/:year/:month', (req, res) => {
   res.send(req.query);
});


app.post('/api/courses', (req, res) => {
   //Validación del body
   const {error} = schemasValidation.validateCourse(req.body);
   if (error) return res.status(400).send(result.error.details[0].message);

   //Cración del curso
   const course = {
      id: courses.length + 1,
      name: req.body.name
   };

   courses.push(course); 
   res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
   //Búsqueda del id
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("No se encontró el elemento");

   //Validación del body
   const {error} = schemasValidation.validateCourse(req.body); //Destructuring result.error
   if (error) return res.status(400).send(result.error.details[0].message);

   //Actualización del elemento
   course.name = req.params.name;
   res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
   //Búsqueda del id
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("No se encontró el elemento");

   //Borrar el elemento
   const index = courses.indexOf(course);
   courses.splice(index, 1);
   res.send(course);
});


// PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));