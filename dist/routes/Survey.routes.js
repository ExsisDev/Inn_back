"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Survey.controller'),
    createSurvey = _require3.createSurvey;
/** Rutas para /api/surveys/

/**
 * Crear una encuesta con body (solo para admin).
 * Además enlaza las preguntas correspondientes
 * {"survey_date", "user_id_creator"}
 */


router.post('/', [auth, isAdmin], createSurvey);
module.exports = router;