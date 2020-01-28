"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Ally.controller'),
    createAlly = _require3.createAlly,
    updateAlly = _require3.updateAlly,
    getAllyById = _require3.getAllyById,
    getAllies = _require3.getAllies,
    getCurrentAlly = _require3.getCurrentAlly;
/*** Rutas para /api/allies*/

/**
 * Actualizar horas y/o categorias del aliado (solo para admin).
 * { ally_categories, ally_month_experimentation_hours, 
 * ally_month_experimentation_hours}
 * retorna  un bojeto con los siguientes atributos: 
 * {
 *   id_ally, ally_name, ally_nit, ally_web_page,
 *   ally_phone, ally_month_ideation_hours, ally_month_experimentation_hours, 
 *   ally_challenge_ideation_hours, ally_challenge_experimentation_hours,
 *   ally_categories [ { id_category, category_name } ]
 * }
 */


router.get('/me', [auth], getCurrentAlly);
router.get('/:idAlly', [auth, isAdmin], getAllyById);
router.put('/:idAlly', [auth], updateAlly);
/**
 * Obtener retos por página
 */

router.get('/page/:page', [auth], getAllies);
/** 
 * Crear un aliado con body (Solo para admin)
 * {fk_id_role, fk_user_state, user_email, user_password, ally_name, ally_nit, 
 * ally_web_page, ally_phone, ally_month_ideation_hours, ally_month_experimentation_hours,
 * ally_challenge_ideation_hours, ally_challenge_experimentation_hours,
 * ally_categories, ally_resources}
 * retornando el token del aliado creado en el header 
 */

router.post('/', [auth, isAdmin], createAlly);
module.exports = router;