const express = require('express');
const getCategories = require('./../controllers/categoryController');
const authMiddleware = require('../helpers/authMiddleware');


const router = express.Router();

router.get('/', getCategories.getCategories);
router.post('/', getCategories.postCategories); //protected globally
router.get('/:id', getCategories.getCategoryById);
router.put('/:id', getCategories.updateCategoryById); //protected globally
router.delete('/:id', getCategories.deleteCategoryById); //protected globally


module.exports = router;