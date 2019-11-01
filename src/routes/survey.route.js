const express = require('express');
const router = express.Router();

const {
   getAllSurveys
} = require('../controllers/survey.controller');


/*** Rutas para /api/surveys*/

/**
 * Obtener todas las encuestas
 */
router.get('/', getAllSurveys);

module.exports = router;