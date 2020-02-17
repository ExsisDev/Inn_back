"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/Auth'),
    auth = _require.auth;

var _require2 = require('../middleware/Admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Challenge.controller'),
    createChallenge = _require3.createChallenge,
    getAllChallenges = _require3.getAllChallenges,
    getChallengesByPageAndStatus = _require3.getChallengesByPageAndStatus,
    getChallengesByPageStatusAndPhrase = _require3.getChallengesByPageStatusAndPhrase,
    deleteChallenge = _require3.deleteChallenge,
    updateChallenge = _require3.updateChallenge,
    getFinalComment = _require3.getFinalComment;
/*** Rutas para /api/challenge*/

/**
 * Obtener los comentarios finales del reto
 */


router.get('/finalComment/:idChallenge', getFinalComment);
/**
 * Obtener retos por categoría, página y palabra de busqueda
 */

router.get('/:page/:status/search', [auth], getChallengesByPageStatusAndPhrase);
/**
 * Obtener retos por categoría y página
 */

router.get('/:page/:status', [auth], getChallengesByPageAndStatus);
/**
 * Eliminar un reto (Solo usuario administrador)
 */

router["delete"]('/:idChallenge', [auth, isAdmin], deleteChallenge);
/**
 * Actualizar un reto pasando en body los atributos
 */

router.put('/:idChallenge', [auth], updateChallenge);
/** 
 * Crear un reto con body (Solo para admin)
 * {"fk_id_survey","fk_id_company","challenge_name",
 * "challenge_description","fk_id_challenge_state", "close_date",
 * 
 * "survey_date", "user_id_creator"
 * 
 * "categoies_selected"}
 */

router.post('/', [auth, isAdmin], createChallenge);
module.exports = router;