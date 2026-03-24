const BASE_URL = "http://localhost:5000";

// Load books
async function loadBooks() {
  try {
    const res = await fetch(`${BASE_URL}/api/books`);
    const data = await res.json();

    const list = document.getElementById("bookList");
    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = "<li>No books available</li>";
      return;
    }

    data.forEach(book => {
      const li = document.createElement("li");
      li.textContent = book.title;
      list.appendChild(li);
    });

  } catch (err) {
    showMessage("Error loading books");
  }
}

// Add book
async function addBook() {
  const title = document.getElementById("bookTitle").value;

  if (!title) {
    showMessage("Please enter a book name");
    return;
  }

  await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  showMessage("✅ Book Added!");
  document.getElementById("bookTitle").value = "";
  loadBooks();
}

// Place order
async function placeOrder() {
  const book = document.getElementById("orderBook").value;

  if (!book) {
    showMessage("Please enter a book name");
    return;
  }

  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book })
  });

  const data = await res.json();
  showMessage("📦 " + data.message);
  document.getElementById("orderBook").value = "";
}

// Message helper
function showMessage(msg) {
  const el = document.getElementById("message");
  el.innerText = msg;
  setTimeout(() => el.innerText = "", 3000);
}