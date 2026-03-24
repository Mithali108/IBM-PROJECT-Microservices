const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Place a new order
router.post('/orders', orderController.placeOrder);

// Get all orders
router.get('/orders', orderController.getAllOrders);

// Get a specific order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update an order status
router.put('/orders/:id', orderController.updateOrderStatus);

// Delete an order
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;