const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const router = express.Router();


const {
   authenticateAttempts,
   changePassword
} = require('../controllers/User.controller');


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