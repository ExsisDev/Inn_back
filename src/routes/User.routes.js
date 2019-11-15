const express = require('express');
const router = express.Router();


const {
   authenticateUser,
   authenticateAttempts
} = require('../controllers/User.controller');


/*** Rutas para /api/allies*/

/** 
 * Validar un usuario administrador o aliado
 * {user_email, user_password}
 * retornando el token en el header 
 */
// router.post('/', authenticateUser);

router.post('/', authenticateAttempts);

module.exports = router;