"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Ally.controller'),
    createAlly = _require3.createAlly,
    createAllyOptional = _require3.createAllyOptional;
/*** Rutas para /api/allies*/

/** 
 * Crear un aliado con body (Solo para admin)
 * {fk_id_role, fk_user_state, user_email, user_password, user_last_login, ally_name, ally_nit, 
 * ally_web_page, ally_phone, ally_month_ideation_hours, ally_month_experimentation_hours}
 * retornando el token del aliado creado en el header 
 */


router.post('/', [auth, isAdmin], createAlly);
router.post('/test', [auth, isAdmin], createAllyOptional);
module.exports = router;