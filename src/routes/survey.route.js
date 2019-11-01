const express = require('express');
const router = express.Router();

const {
   getAllSurveys,
   createSurvey
} = require('../controllers/survey.controller');


/*** Rutas para /api/surveys*/

/**
 * Obtener todas las encuestas
 */
router.get('/', getAllSurveys);

/**
 * Crear una encuesta
 */
router.post('/', createSurvey);

module.exports = router;