const express = require('express');
const router = express.Router();

const { 
   createCategory,
   getAllCategories,
   getByCategoryId,
   updateCategory,
   deleteCategory,
   getCategoriesByIdArtist 
} = require('../controllers/category.controller');

// (/api/categories)

router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getByCategoryId);
router.get('/categoriesByArtist/:id_artist', getCategoriesByIdArtist);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;