"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/Auth'),
    auth = _require.auth;

var _require2 = require('../middleware/Admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Company.controller'),
    getAllCompanies = _require3.getAllCompanies;
/*** Rutas para /api/companies*/

/** 
 * Obtener todas las compañias disponibles
 */


router.get('/', [auth, isAdmin], getAllCompanies);
module.exports = router;