const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB later)
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "fiction",
    price: 12.99,
    description: "A classic American novel set in the Jazz Age.",
    stock: 15,
    rating: 4.5,
    image: null
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "fiction",
    price: 14.99,
    description: "A gripping tale of racial injustice and childhood innocence.",
    stock: 20,
    rating: 4.8,
    image: null
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "sci-fi",
    price: 13.99,
    description: "A dystopian novel about totalitarianism.",
    stock: 12,
    rating: 4.7,
    image: null
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "non-fiction",
    price: 18.99,
    description: "A brief history of humankind.",
    stock: 18,
    rating: 4.6,
    image: null
  },
  {
    id: 5,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    category: "mystery",
    price: 15.99,
    description: "A thrilling mystery novel set in Sweden.",
    stock: 10,
    rating: 4.4,
    image: null
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "romance",
    price: 11.99,
    description: "A timeless love story with social commentary.",
    stock: 25,
    rating: 4.9,
    image: null
  }
];

let orders = [
  {
    id: 1,
    customerName: "John Doe",
    bookCount: 2,
    total: 27.98,
    status: "Completed",
    date: new Date("2024-03-20")
  },
  {
    id: 2,
    customerName: "Jane Smith",
    bookCount: 1,
    total: 12.99,
    status: "Pending",
    date: new Date("2024-03-22")
  }
];

let orderIdCounter = 3;

// ==================== BOOKS ROUTES ====================

// Get all books with filters
app.get("/api/books", (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  
  let filteredBooks = books;
  
  if (search) {
    filteredBooks = filteredBooks.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredBooks = filteredBooks.filter(b => b.category === category);
  }
  
  if (minPrice || maxPrice) {
    filteredBooks = filteredBooks.filter(b => {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return b.price >= min && b.price <= max;
    });
  }
  
  res.json(filteredBooks);
});

// Get single book
app.get("/api/books/:id", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// Add new book
app.post("/api/books", (req, res) => {
  const { title, author, category, price, description, stock, image } = req.body;
  
  if (!title || !author || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const newBook = {
    id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
    title,
    author,
    category: category || "fiction",
    price: parseFloat(price),
    description: description || "",
    stock: stock || 0,
    rating: 0,
    image: image || null
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// Update book
app.put("/api/books/:id", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  
  Object.assign(book, req.body);
  res.json(book);
});

// Delete book
app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });
  
  books.splice(index, 1);
  res.json({ message: "Book deleted successfully" });
});

// ==================== ORDERS ROUTES ====================

// Get all orders
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Create new order
app.post("/api/orders", (req, res) => {
  const { customerName, items, total } = req.body;
  
  if (!customerName || !items || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const newOrder = {
    id: orderIdCounter++,
    customerName,
    bookCount: items.length,
    total: parseFloat(total),
    status: "Pending",
    date: new Date()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Update order status
app.put("/api/orders/:id", (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found" });
  
  Object.assign(order, req.body);
  res.json(order);
});

// ==================== ADMIN STATS ====================

// Get dashboard stats
app.get("/api/admin/stats", (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  
  const stats = {
    totalBooks: books.length,
    totalOrders: orders.length,
    totalRevenue: totalRevenue.toFixed(2),
    pendingOrders: pendingOrders,
    completedOrders: completedOrders,
    totalCustomers: new Set(orders.map(o => o.customerName)).size,
    avgOrderValue: (orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0)
  };
  
  res.json(stats);
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "BookVerse API is running!" });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 BookVerse API running on http://localhost:${PORT}`);
  console.log(`📚 Frontend: http://localhost:5000/Frontend/pages/client/index.html\n`);
});