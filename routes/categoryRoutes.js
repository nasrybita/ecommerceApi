const express = require('express');
const getCategories = require('./../controllers/categoryController');


const router = express.Router();

router.get('/', getCategories.getCategories);
router.post('/', getCategories.postCategories);
router.get('/:id', getCategories.getCategoryById);
router.put('/:id', getCategories.updateCategoryById);
router.delete('/:id', getCategories.deleteCategoryById);


module.exports = router;