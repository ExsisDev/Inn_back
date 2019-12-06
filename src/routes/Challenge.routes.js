const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/Auth');
const { isAdmin } = require('../middleware/Admin');


const {
   createChallenge,
   getAllChallenges,
   getChallengesByPageAndStatus
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
 * Obtener todos los retos
 */
router.get('/', [auth], getAllChallenges);

/**
 * Obtener retos por categoría y página
 */
router.get('/:page/:status', [auth], getChallengesByPageAndStatus);


module.exports = router;