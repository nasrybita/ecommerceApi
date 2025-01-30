const express = require('express');
const getProducts = require('./../controllers/productController');
const authMiddleware = require('../helpers/authMiddleware');


const router = express.Router();

router.get('/get/count', getProducts.getProductsCount); 
router.get('/get/featured/:limit?', getProducts.getFeaturedProducts); 
router.get('/filter', getProducts.getFilteredProducts);
router.post('/', getProducts.postProducts); //protected globally
router.get('/:id', getProducts.getProductById);
router.put('/:id', getProducts.updateProductById); //protected globally
router.delete('/:id', getProducts.deleteProductById); //protected globally
router.get('/', getProducts.getProducts);



module.exports = router;






