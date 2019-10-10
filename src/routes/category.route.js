const express = require('express');
const router = express.Router();

const {createCategory, getAllCategories, getByCategoryId, updateCategory, deleteCategory} = require('../controllers/category.controller');

router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getByCategoryId);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;