"use strict";

var express = require('express');

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var router = express.Router();

var _require3 = require('../controllers/User.controller'),
    authenticateAttempts = _require3.authenticateAttempts,
    changePassword = _require3.changePassword,
    generateRecoveryToken = _require3.generateRecoveryToken,
    recoverPassword = _require3.recoverPassword,
    validateRecoveryToken = _require3.validateRecoveryToken;
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

router.post('/changePassword', auth, changePassword);
/**
 * Generar token para la recuperación de contraseña.
 * {user_email}
 */

router.post('/recoverPassword', generateRecoveryToken);
/**
 * Validar recovery token
 */

router.get('/recoverPassword/:idUser/:token', validateRecoveryToken);
/**
 * Recuperar contraseña
 * {id_user, recovery_token,  new_password, confirm_new_password}
 */

router.put('/recoverPassword/', recoverPassword);
module.exports = router;