// This file contains JavaScript functions for admin-side interactions, such as adding books and managing inventory.

document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
});

function loadBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = '';
            data.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} by ${book.author} - $${book.price}`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteBook(book.id);
                li.appendChild(deleteButton);
                bookList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading books:', error));
}

function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const price = document.getElementById('bookPrice').value;
    const imageUrl = document.getElementById('bookImage').value;

    const newBook = { title, author, price, imageUrl };

    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = 'Book added successfully!';
        loadBooks();
    })
    .catch(error => console.error('Error adding book:', error));
}

function deleteBook(bookId) {
    fetch(`/api/books/${bookId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            loadBooks();
            document.getElementById('message').textContent = 'Book deleted successfully!';
        } else {
            throw new Error('Failed to delete book');
        }
    })
    .catch(error => console.error('Error deleting book:', error));
}