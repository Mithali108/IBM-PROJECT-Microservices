const API_URL = "http://localhost:5000/api";

// Fetch all books
async function fetchBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) throw new Error("Failed to fetch books");
    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// Add a new book
async function addBook(bookData) {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData)
    });
    if (!response.ok) throw new Error("Failed to add book");
    return await response.json();
  } catch (error) {
    console.error("Error adding book:", error);
    return null;
  }
}

// Update a book
async function updateBook(bookId, bookData) {
  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData)
    });
    if (!response.ok) throw new Error("Failed to update book");
    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
}

// Delete a book
async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete book");
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  }
}

// Fetch all orders
async function fetchOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Create a new order
async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error("Failed to create order");
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

// Update an order
async function updateOrder(orderId, orderData) {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error("Failed to update order");
    return await response.json();
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
}

// Get dashboard stats
async function getDashboardStats() {
  try {
    const response = await fetch(`${API_URL}/admin/stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalBooks: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0
    };
  }
}