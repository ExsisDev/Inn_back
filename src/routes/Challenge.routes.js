const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/Auth');
const { isAdmin } = require('../middleware/Admin');


const {
   createChallenge,
   getAllChallenges,
   getChallengesByPageAndStatus,
   getChallengesByPageStatusAndPhrase,
   deleteChallenge,
   updateChallenge,
   getFinalComment
} = require('../controllers/Challenge.controller');


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
router.delete('/:idChallenge', [auth, isAdmin], deleteChallenge);


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