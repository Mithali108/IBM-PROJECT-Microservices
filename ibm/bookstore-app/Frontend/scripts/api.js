// This file contains functions for making API calls to the backend for book and order data.

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

// Function to fetch all books
async function fetchBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

// Function to fetch a single book by ID
async function fetchBookById(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const book = await response.json();
        return book;
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
}

// Function to add a new book
async function addBook(bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const newBook = await response.json();
        return newBook;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
}

// Function to place an order
async function placeOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
}

// Function to fetch order history
async function fetchOrderHistory(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw error;
    }
}