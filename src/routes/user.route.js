const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const {
   createUser,
   authenticateUser,
   deleteUser,
   getCurrentUser,
   updateUser
} = require('../controllers/user.controller');


/*** Rutas para /api/users*/

/** 
 * Creación de un usuario {name, email, password, is_admin} retornando el token en el header 
 * (Solo para admin)
 */
router.post('/', [auth, isAdmin], createUser);
/** 
 * Login de usuario o admin con body {name, password, is_admin} retornando el token en el header
 */
router.post('/auth', authenticateUser);
/** 
 * Obtener {id_user, name, email, is_admin} dado un token usuario o admin
 * (para usuarios y admin autenticados)
 */
router.get('/me', [auth], getCurrentUser);
/**
 * Borrar un usuario dado un id
 * (Solo para admin)
 */
router.delete('/:id',[auth, isAdmin], deleteUser);
/**
 * Actualizar un uasuario dado un id y {name, password, email}
 * (Solo para admin)
 */
router.put('/:id', [auth, isAdmin], updateUser);

module.exports = router;