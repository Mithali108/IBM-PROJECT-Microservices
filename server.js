const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Frontend")));

// ==================== IN-MEMORY DATABASE ====================
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "fiction",
    price: 599,
    description: "A classic American novel set in the Jazz Age exploring themes of wealth, love, and the American Dream.",
    stock: 15,
    rating: 4.5,
    image: "https://covers.openlibrary.org/b/id/7725342-M.jpg"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "fiction",
    price: 699,
    description: "A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.",
    stock: 20,
    rating: 4.8,
    image: "https://covers.openlibrary.org/b/id/7877500-M.jpg"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "sci-fi",
    price: 549,
    description: "A dystopian novel about totalitarianism and surveillance that remains strikingly relevant today.",
    stock: 12,
    rating: 4.7,
    image: "https://covers.openlibrary.org/b/id/7878500-M.jpg"
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "non-fiction",
    price: 899,
    description: "A fascinating exploration of how Homo sapiens conquered the world and shaped human civilization.",
    stock: 18,
    rating: 4.6,
    image: "https://covers.openlibrary.org/b/id/8414886-M.jpg"
  },
  {
    id: 5,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    category: "mystery",
    price: 749,
    description: "A thrilling mystery novel featuring a brilliant hacker and an investigative journalist uncovering dark secrets.",
    stock: 10,
    rating: 4.4,
    image: "https://covers.openlibrary.org/b/id/7820341-M.jpg"
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "romance",
    price: 449,
    description: "A timeless love story with brilliant social commentary about marriage, class, and personal growth.",
    stock: 25,
    rating: 4.9,
    image: "https://covers.openlibrary.org/b/id/8233156-M.jpg"
  },
  {
    id: 7,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "fiction",
    price: 579,
    description: "A coming-of-age novel following teenage protagonist Holden Caulfield through New York City.",
    stock: 14,
    rating: 4.3,
    image: "https://covers.openlibrary.org/b/id/8415024-M.jpg"
  },
  {
    id: 8,
    title: "Atomic Habits",
    author: "James Clear",
    category: "non-fiction",
    price: 799,
    description: "Transform your life by understanding how small habits compound into remarkable results over time.",
    stock: 22,
    rating: 4.8,
    image: "https://covers.openlibrary.org/b/id/9360736-M.jpg"
  },
  {
    id: 9,
    title: "Dune",
    author: "Frank Herbert",
    category: "sci-fi",
    price: 849,
    description: "An epic space opera set on a desert planet with complex politics, ecology, and theological themes.",
    stock: 16,
    rating: 4.7,
    image: "https://covers.openlibrary.org/b/id/7877502-M.jpg"
  },
  {
    id: 10,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "mystery",
    price: 699,
    description: "A psychological thriller about a woman who commits a shocking crime and then never speaks again.",
    stock: 17,
    rating: 4.5,
    image: "https://covers.openlibrary.org/b/id/9360737-M.jpg"
  },
  {
    id: 11,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "fiction",
    price: 649,
    description: "A philosophical novel exploring alternate lives and the infinite possibilities of human existence.",
    stock: 19,
    rating: 4.6,
    image: "https://covers.openlibrary.org/b/id/9360738-M.jpg"
  },
  {
    id: 12,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "non-fiction",
    price: 899,
    description: "Explore the two systems of thought that drive decision-making and shape our understanding of the world.",
    stock: 13,
    rating: 4.7,
    image: "https://covers.openlibrary.org/b/id/8234156-M.jpg"
  }
];

let orders = [
  {
    id: 1,
    customerName: "Rajesh Kumar",
    bookCount: 2,
    total: 1298,
    status: "Completed",
    date: new Date("2024-03-20")
  },
  {
    id: 2,
    customerName: "Priya Singh",
    bookCount: 1,
    total: 599,
    status: "Pending",
    date: new Date("2024-03-22")
  }
];

let orderIdCounter = 3;

// ==================== FRONTEND ROUTES ====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/pages/client/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/pages/admin/dashboard.html"));
});

// ==================== API ROUTES ====================

// Get all books with filters
app.get("/api/books", (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  
  let filteredBooks = [...books];
  
  if (search) {
    filteredBooks = filteredBooks.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category && category !== "") {
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
  
  if (!title || !author || price === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const newBook = {
    id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
    title,
    author,
    category: category || "fiction",
    price: parseFloat(price),
    description: description || "",
    stock: parseInt(stock) || 0,
    rating: 0,
    image: image || "https://covers.openlibrary.org/b/id/7725342-M.jpg"
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
  
  if (!customerName || !items || total === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const newOrder = {
    id: orderIdCounter++,
    customerName,
    bookCount: items.length || 1,
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
    avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0
  };
  
  res.json(stats);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "BookVerse API is running!", status: "OK" });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 BookVerse Server is running!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`\n📖 BookStore (Client): http://localhost:${PORT}`);
  console.log(`👨‍💼 Admin Panel:       http://localhost:${PORT}/admin`);
  console.log(`📡 API Endpoint:      http://localhost:${PORT}/api`);
  console.log(`\n${"=".repeat(60)}\n`);
});