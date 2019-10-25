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
    getCurrentUser = _require3.getCurrentUser;
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

router.get('/me', [auth, isAdmin], getCurrentUser);
/**
 * Borrar un usuario dado un id
 */

router["delete"]('/:id', deleteUser);
module.exports = router;