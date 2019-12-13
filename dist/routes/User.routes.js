"use strict";

var express = require('express');

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var router = express.Router();

var _require3 = require('../controllers/User.controller'),
    authenticateAttempts = _require3.authenticateAttempts,
    changePassword = _require3.changePassword;
/*** Rutas para /api/allies*/

/** 
 * Validar log in de un usuario administrador o aliado
 * {user_email, user_password}
 * retornando el token en el header 
 */


router.post('/', authenticateAttempts);
/**
 * Cambiar la contraseña
 * {actual_password, new_password, confirm_new_password}
 */

router.post('/changePassword', [auth, isAdmin], changePassword);
module.exports = router;