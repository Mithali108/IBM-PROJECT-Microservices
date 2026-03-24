const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Route to get all books
router.get('/', bookController.getAllBooks);

// Route to get a book by ID
router.get('/:id', bookController.getBookById);

// Route to add a new book
router.post('/', bookController.addBook);

// Route to update a book by ID
router.put('/:id', bookController.updateBook);

// Route to delete a book by ID
router.delete('/:id', bookController.deleteBook);

module.exports = router;