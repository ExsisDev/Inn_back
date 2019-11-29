const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/Auth');
const { isAdmin } = require('../middleware/Admin');

const { getAllCompanyCategories } = require('../controllers/AllyCategory.controller');


/*** Rutas para /api/al_categories/

/** 
 * Obtener todas las categorias de compañias
 */
router.get('/', [auth, isAdmin], getAllCompanyCategories);

module.exports = router;