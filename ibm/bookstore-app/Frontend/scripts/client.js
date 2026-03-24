// This file contains JavaScript functions for client-side interactions, such as searching and filtering books.

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});

function loadBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => console.error('Error loading books:', error));
}

function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}" />
            <h4>${book.title}</h4>
            <p>Author: ${book.author}</p>
            <p>Price: $${book.price}</p>
            <button onclick="viewBookDetails('${book.id}')">View Details</button>
        `;
        bookList.appendChild(listItem);
    });
}

function viewBookDetails(bookId) {
    window.location.href = `book-details.html?id=${bookId}`;
}

function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const bookItems = document.querySelectorAll('#bookList li');

    bookItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        if (title.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterBooks(category) {
    const bookItems = document.querySelectorAll('#bookList li');

    bookItems.forEach(item => {
        const bookCategory = item.getAttribute('data-category');
        if (bookCategory === category || category === 'all') {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}