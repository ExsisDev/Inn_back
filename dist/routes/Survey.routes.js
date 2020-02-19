"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Survey.controller'),
    createSurvey = _require3.createSurvey,
    saveAnswerSurveyQuestion = _require3.saveAnswerSurveyQuestion,
    getQuestionsBySurvey = _require3.getQuestionsBySurvey,
    getchallangeState = _require3.getchallangeState;
/** Rutas para /api/surveys/

/**
 * Crear una encuesta con body (solo para admin).
 * Además enlaza las preguntas correspondientes
 * {"survey_date", "user_id_creator"}
 */


router.post('/', [auth, isAdmin], createSurvey);
router.get('/:id_challenge', getQuestionsBySurvey);
router.put('/', [auth], saveAnswerSurveyQuestion);
router.get('/:id_challenge', getchallangeState);
module.exports = router;