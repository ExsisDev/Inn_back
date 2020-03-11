const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const router = express.Router();


const {
   authenticateAttempts,
   changePassword,
   generateRecoveryToken,
   recoverPassword,
   validateRecoveryToken,
   createAdmin
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

/**
 * Crear un administrador
 * {fk_id_role, fk_user_state, user_email, user_password, login_attemps, recovery_token, 
 * recovery_token_expiration}
 */
router.post('/create/newAdmin', createAdmin);

module.exports = router;