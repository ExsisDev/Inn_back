"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/category.controller'),
    createCategory = _require.createCategory,
    getAllCategories = _require.getAllCategories,
    getByCategoryId = _require.getByCategoryId,
    updateCategory = _require.updateCategory,
    deleteCategory = _require.deleteCategory,
    getCategoriesByIdArtist = _require.getCategoriesByIdArtist; // (/api/categories)


router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getByCategoryId);
router.get('/categoriesByArtist/:id_artist', getCategoriesByIdArtist);
router.put('/:id', updateCategory);
router["delete"]('/:id', deleteCategory);
module.exports = router;