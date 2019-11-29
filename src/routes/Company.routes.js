const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/Auth');
const { isAdmin } = require('../middleware/Admin');

const {getAllCompanies} = require('../controllers/Company.controller');


/*** Rutas para /api/companies*/

/** 
 * Obtener todas las compañias disponibles
 */
router.get('/', [auth, isAdmin], getAllCompanies);

module.exports = router;