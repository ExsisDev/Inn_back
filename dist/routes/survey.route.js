"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/survey.controller'),
    getAllSurveys = _require.getAllSurveys;
/*** Rutas para /api/surveys*/

/**
 * Obtener todas las encuestas
 */


router.get('/', getAllSurveys);
module.exports = router;