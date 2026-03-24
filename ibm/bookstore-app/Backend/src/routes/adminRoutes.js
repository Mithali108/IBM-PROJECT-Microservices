const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to add a new book
router.post('/add-book', adminController.addBook);

// Route to manage existing books
router.get('/manage-books', adminController.getBooks);
router.put('/manage-books/:id', adminController.updateBook);
router.delete('/manage-books/:id', adminController.deleteBook);

// Route to get analytics
router.get('/analytics', adminController.getAnalytics);

// Route to track purchases
router.get('/purchases', adminController.getPurchases);

module.exports = router;