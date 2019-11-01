"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/user.controller'),
    createUser = _require3.createUser,
    authenticateUser = _require3.authenticateUser,
    deleteUser = _require3.deleteUser,
    getCurrentUser = _require3.getCurrentUser,
    updateUser = _require3.updateUser;
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

router["delete"]('/:id', [auth, isAdmin], deleteUser);
/**
 * Actualizar un uasuario dado un id y {name, password, email}
 * (Solo para admin)
 */

router.put('/:id', [auth, isAdmin], updateUser);
module.exports = router;