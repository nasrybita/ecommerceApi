const express = require('express');
const getProducts = require('./../controllers/productController');

const router = express.Router();

router.get('/get/count', getProducts.getProductsCount); 
router.get('/get/featured/:limit?', getProducts.getFeaturedProducts); 
router.get('/filter', getProducts.getFilteredProducts);
router.post('/', getProducts.postProducts);
router.get('/:id', getProducts.getProductById);
router.put('/:id', getProducts.updateProductById);
router.delete('/:id', getProducts.deleteProductById);
router.get('/', getProducts.getProducts);



module.exports = router;






