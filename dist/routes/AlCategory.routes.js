"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/Auth'),
    auth = _require.auth;

var _require2 = require('../middleware/Admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/AlCategory.controller'),
    getAllAlCategories = _require3.getAllAlCategories;
/*** Rutas para /api/al_categories/

/** 
 * Obtener todas las categorias de compañias
 */


router.get('/', [auth, isAdmin], getAllAlCategories);
module.exports = router;