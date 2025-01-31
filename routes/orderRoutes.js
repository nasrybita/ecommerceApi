const express = require('express');
const getOrders = require('./../controllers/orderController');
const authMiddleware = require('../helpers/authMiddleware');

const router = express.Router();

router.get('/', getOrders.getOrders); //protected gloabally
router.post('/', getOrders.createOrder); //protected gloabally
router.get('/:id', getOrders.getOrderById); //protected gloabally
router.put('/:id', getOrders.updateOrderStatus); //protected gloabally
router.delete('/:id', getOrders.deleteOrderById); // Protected globally
router.get('/get/totalsales', getOrders.getTotalSales); // Protected globally
router.get('/get/count', getOrders.getOrderCount); // Protected globally
router.get('/get/userorders/:userid', getOrders.getUserOrders); //protected globally


module.exports = router;

