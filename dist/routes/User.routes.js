"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/User.controller'),
    authenticateUser = _require.authenticateUser,
    authenticateAttempts = _require.authenticateAttempts;
/*** Rutas para /api/allies*/

/** 
 * Validar un usuario administrador o aliado
 * {user_email, user_password}
 * retornando el token en el header 
 */
// router.post('/', authenticateUser);


router.post('/', authenticateAttempts);
module.exports = router;