"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/Auth'),
    auth = _require.auth;

var _require2 = require('../middleware/Admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Challenge.controller'),
    createChallenge = _require3.createChallenge,
    getAllChallenges = _require3.getAllChallenges;
/*** Rutas para /api/challenge*/

/** 
 * Crear un reto con body (Solo para admin)
 * {"fk_id_survey","fk_id_company","challenge_name",
 * "challenge_description","fk_id_challenge_state"}
 */


router.post('/', [auth, isAdmin], createChallenge);
/**
 * Obtener todos los retos
 */

router.get('/', [auth], getAllChallenges);
module.exports = router;