const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const {
   createUser,
   authenticateUser,
   deleteUser,
   getCurrentUser
} = require('../controllers/user.controller');


/*** Rutas para /api/users*/

/** 
 * Creación de un usuario con body {name, email, password, is_admin} retornando el token en el header 
 */
router.post('/', [auth, isAdmin], createUser);
/** 
 * Login de un usuario o administrador con body {name, password, is_admin} retornando el token en el header
 */
router.post('/auth', authenticateUser);
/** 
 * Obtener {id_user, name, email, is_admin} dado un token 
 */
router.get('/me', [auth], getCurrentUser);
/**
 * Borrar un usuario dado un id
 */
router.delete('/:id', deleteUser);


module.exports = router;