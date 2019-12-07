const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/Auth');
const { isAdmin } = require('../middleware/Admin');

const { getAllAlCategories } = require('../controllers/AlCategory.controller');


/*** Rutas para /api/al_categories/

/** 
 * Obtener todas las categorias de compañias
 */
router.get('/', [auth, isAdmin], getAllAlCategories);

module.exports = router;