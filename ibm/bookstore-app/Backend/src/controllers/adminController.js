// Backend/src/controllers/adminController.js

const Book = require('../models/Book');
const Order = require('../models/Order');

// Add a new book to the inventory
exports.addBook = async (req, res) => {
    try {
        const { title, author, price, image, category } = req.body;
        const newBook = new Book({ title, author, price, image, category });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
};

// Get all books for management
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving books', error });
    }
};

// Update a book's details
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// Delete a book from the inventory
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await Book.findByIdAndDelete(id);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};

// Get total revenue from orders
exports.getTotalRevenue = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        res.status(200).json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating total revenue', error });
    }
};