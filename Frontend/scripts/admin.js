let books = [];
let orders = [];
let editingBookId = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadBooks();
  loadOrders();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Auto-refresh data every 5 seconds to sync with client changes
  setInterval(() => {
    loadDashboard();
    loadBooks();
    loadOrders();
  }, 5000);
  
  showSection("dashboard");
});

async function loadDashboard() {
  try {
    const stats = await getDashboardStats();
    
    document.getElementById("totalBooks").textContent = stats.totalBooks || "0";
    document.getElementById("totalOrders").textContent = stats.totalOrders || "0";
    document.getElementById("totalRevenue").textContent = "₹" + (parseInt(stats.totalRevenue) || "0");
    document.getElementById("pendingOrders").textContent = stats.pendingOrders || "0";
    document.getElementById("totalCustomers").textContent = stats.totalCustomers || "0";
    document.getElementById("avgOrderValue").textContent = "₹" + (parseInt(stats.avgOrderValue) || "0");
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

async function loadBooks() {
  try {
    books = await fetchBooks();
    displayBooksTable();
  } catch (error) {
    console.error("Error loading books:", error);
    showNotification("Failed to load books", "danger");
  }
}

function displayBooksTable() {
  const tbody = document.getElementById("booksTableBody");
  tbody.innerHTML = "";

  if (books.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-light);">
          <i class="fas fa-inbox"></i> No books available. Add one to get started!
        </td>
      </tr>
    `;
    return;
  }

  books.forEach(book => {
    const row = document.createElement("tr");
    const stockClass = book.stock > 15 ? 'badge-success' : book.stock > 5 ? 'badge-warning' : 'badge-danger';
    
    row.innerHTML = `
      <td><strong>#${book.id}</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${book.image}" alt="${book.title}" 
               style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px; background: var(--light-bg);"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2250%22%3E%3Crect fill=%22%23e2e8f0%22 width=%2240%22 height=%2250%22/%3E%3C/svg%3E'">
          <div>
            <strong>${book.title}</strong>
            <p style="font-size: 0.85rem; color: var(--text-light); margin: 4px 0 0 0;">by ${book.author}</p>
          </div>
        </div>
      </td>
      <td>${book.author}</td>
      <td><span class="badge badge-primary">${book.category.charAt(0).toUpperCase() + book.category.slice(1)}</span></td>
      <td><strong style="color: var(--accent-color); font-size: 1.1rem;">₹${book.price.toFixed(0)}</strong></td>
      <td>
        <span class="badge ${stockClass}">
          <i class="fas fa-box"></i> ${book.stock} units
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editBook(${book.id})" title="Edit this book">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn-delete" onclick="deleteBookConfirm(${book.id})" title="Delete this book">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function loadOrders() {
  try {
    orders = await fetchOrders();
    displayOrdersTable();
  } catch (error) {
    console.error("Error loading orders:", error);
    showNotification("Failed to load orders", "danger");
  }
}

function displayOrdersTable() {
  const tbody = document.getElementById("ordersTableBody");
  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-light);">
          <i class="fas fa-shopping-bag"></i> No orders yet. Waiting for customers...
        </td>
      </tr>
    `;
    return;
  }

  orders.forEach(order => {
    const row = document.createElement("tr");
    const status = order.status || "Pending";
    const statusClass = `status-${status.toLowerCase()}`;
    const orderDate = order.date ? new Date(order.date).toLocaleDateString('en-IN') : "-";
    const totalAmount = Number(order.total || 0);
    const bookCount = Number(order.bookCount || 0);
    
    row.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td>
        <div style="font-weight: 500;">
          ${order.customerName}
        </div>
      </td>
      <td>
        <span class="badge badge-primary">
          <i class="fas fa-book"></i> ${bookCount}
        </span>
      </td>
      <td><strong style="color: var(--success-color); font-size: 1.05rem;">₹${totalAmount.toFixed(0)}</strong></td>
      <td><span class="status-badge ${statusClass}"><i class="fas fa-circle"></i> ${status}</span></td>
      <td style="color: var(--text-light);">
        <i class="fas fa-calendar"></i> ${orderDate}
      </td>
      <td>
        <div class="action-buttons" style="flex-direction: column; gap: 6px;">
          <button class="btn-view" onclick="viewOrder(${order.id})" style="width: 100%;">
            <i class="fas fa-eye"></i> View
          </button>
          <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--border-light); font-size: 0.75rem; width: 100%; background: var(--white); cursor: pointer;">
            <option value="${status}" selected>${status}</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Completed">✅ Completed</option>
            <option value="Cancelled">❌ Cancelled</option>
          </select>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active");
  });
  
  // Show selected section
  const selectedSection = document.getElementById(sectionName);
  if (selectedSection) {
    selectedSection.classList.add("active");
  }

  // Update sidebar active state
  document.querySelectorAll(".sidebar-menu a").forEach(link => {
    link.classList.remove("active");
  });
  
  // Add active class to the clicked item
  event?.target?.closest("a")?.classList.add("active");
  
  // Update page title
  const titles = {
    dashboard: "📊 Dashboard",
    books: "📖 Manage Books",
    orders: "🛍️ Manage Orders"
  };
  document.getElementById("pageTitle").textContent = titles[sectionName] || "Dashboard";
}

function openAddBookForm() {
  editingBookId = null;
  document.querySelector("#addBookForm form").reset();
  document.querySelector("#addBookForm .modal-header h2").textContent = "➕ Add New Book";
  document.getElementById("addBookForm").classList.add("active");
}

function closeAddBookForm() {
  document.getElementById("addBookForm").classList.remove("active");
  editingBookId = null;
  document.querySelector("#addBookForm form").reset();
}

async function submitBook(event) {
  event.preventDefault();

  const bookData = {
    title: document.getElementById("bookTitle").value.trim(),
    author: document.getElementById("bookAuthor").value.trim(),
    description: document.getElementById("bookDescription").value.trim(),
    price: parseFloat(document.getElementById("bookPrice").value),
    category: document.getElementById("bookCategory").value,
    stock: parseInt(document.getElementById("bookStock").value),
    image: document.getElementById("bookImage").value.trim() || "https://covers.openlibrary.org/b/id/7725342-M.jpg"
  };

  // Validation
  if (!bookData.title || !bookData.author || !bookData.price || !bookData.category) {
    showNotification("❌ Please fill all required fields!", "danger");
    return;
  }

  if (bookData.price < 0 || bookData.stock < 0) {
    showNotification("❌ Price and stock cannot be negative!", "danger");
    return;
  }

  try {
    let result;
    
    if (editingBookId) {
      // Update existing book
      result = await updateBook(editingBookId, bookData);
      if (result) {
        showNotification("✓ Book updated successfully!", "success");
        closeAddBookForm();
        loadBooks();
        loadDashboard();
      } else {
        showNotification("✗ Failed to update book!", "danger");
      }
    } else {
      // Add new book
      result = await addBook(bookData);
      if (result) {
        showNotification("✓ Book added successfully!", "success");
        closeAddBookForm();
        loadBooks();
        loadDashboard();
      } else {
        showNotification("✗ Failed to add book!", "danger");
      }
    }
  } catch (error) {
    console.error("Error submitting book:", error);
    showNotification("✗ An error occurred!", "danger");
  }
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) {
    showNotification("❌ Book not found!", "danger");
    return;
  }

  editingBookId = bookId;
  document.getElementById("bookTitle").value = book.title;
  document.getElementById("bookAuthor").value = book.author;
  document.getElementById("bookDescription").value = book.description;
  document.getElementById("bookPrice").value = book.price;
  document.getElementById("bookCategory").value = book.category;
  document.getElementById("bookStock").value = book.stock;
  document.getElementById("bookImage").value = book.image;
  
  document.querySelector("#addBookForm .modal-header h2").textContent = `✏️ Edit: ${book.title}`;
  document.getElementById("addBookForm").classList.add("active");
}

async function deleteBookConfirm(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) {
    showNotification("❌ Book not found!", "danger");
    return;
  }

  if (confirm(`Are you sure you want to delete "${book.title}"?\n\n⚠️ This action cannot be undone.`)) {
    try {
      const success = await deleteBook(bookId);
      if (success) {
        showNotification("✓ Book deleted successfully!", "success");
        loadBooks();
        loadDashboard();
      } else {
        showNotification("✗ Failed to delete book!", "danger");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      showNotification("✗ An error occurred!", "danger");
    }
  }
}

async function updateOrderStatus(orderId, newStatus) {
  if (newStatus === "") return; // No change
  
  try {
    const updatedOrder = await updateOrder(orderId, { status: newStatus });
    if (updatedOrder) {
      showNotification(`✓ Order #${orderId} status updated to ${newStatus}!`, "success");
      loadOrders();
      loadDashboard();
    } else {
      showNotification("✗ Failed to update order status!", "danger");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    showNotification("✗ An error occurred!", "danger");
  }
}

function viewOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    showNotification("❌ Order not found!", "danger");
    return;
  }

  const orderDate = new Date(order.date).toLocaleString('en-IN');
  const details = `
╔════════════════════════════════╗
║     ORDER DETAILS              ║
╚════════════════════════════════╝

📋 Order ID:        #${order.id}
👤 Customer:        ${order.customerName}
📚 Total Books:     ${order.bookCount}
💰 Total Amount:    ₹${order.total.toFixed(0)}
📅 Order Date:      ${orderDate}
✅ Status:          ${order.status}

════════════════════════════════
  `;
  alert(details);
}

function logout() {
  if (confirm("Are you sure you want to logout?\n\n🏠 You will be redirected to the store.")) {
    window.location.href = "/";
  }
}

function updateDateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById("dateTime");
  if (dateTimeElement) {
    dateTimeElement.textContent = now.toLocaleString('en-IN');
  }
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  const bgColor = type === "success" ? "var(--success-color)" : "var(--danger-color)";
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${bgColor};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideUp 0.3s ease;
    font-weight: 600;
    max-width: 400px;
    word-wrap: break-word;
  `;
  notification.innerHTML = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3500);
}

// Prevent form submission with Enter key unless a button is focused
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#addBookForm form");
  if (form) {
    form.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        form.querySelector("button[type='submit']").click();
      }
    });
  }
});