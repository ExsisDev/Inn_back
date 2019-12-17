const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/Auth');
const { isAdmin } = require('../middleware/Admin');


const {
   createChallenge,
   getAllChallenges,
   getChallengesByPageAndStatus,
   getChallengesByPageStatusAndPhrase,
   deleteChallenge
} = require('../controllers/Challenge.controller');


/*** Rutas para /api/challenge*/

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


/**
 * Obtener retos por categoría y página
 */
router.get('/:page/:status', [auth], getChallengesByPageAndStatus);


/**
 * Obtener retos por categoría, página y palabra de busqueda
 */
router.get('/:page/:status/search', [auth], getChallengesByPageStatusAndPhrase);


/**
 * Eliminar un reto (Solo usuario administrador)
 */
router.delete('/:idChallenge', [auth, isAdmin], deleteChallenge);


module.exports = router;