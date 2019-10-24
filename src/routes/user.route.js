const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth'); 

const {
   createUser,
   authenticateUser,
   getCurrentUser
} = require('../controllers/user.controller');

/**
 * Rutas para /api/users:
 * creación de usuario,
 * login de usuario,
 * obtención del usuario actual
 * 
 */

router.post('/', createUser);
router.post('/auth', authenticateUser);
router.get('/me', auth, getCurrentUser);

module.exports = router;