// Seeded initial data
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "fiction",
    price: 399,
    description: "A classic American novel set in the Jazz Age.",
    stock: 15,
    rating: 4.5,
    discount: 10,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%235B21B6' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EThe Great Gatsby%3C/text%3E%3C/svg%3E"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "fiction",
    price: 449,
    description: "A gripping tale of racial injustice and childhood innocence.",
    stock: 20,
    rating: 4.8,
    discount: 5,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%232D5016' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EMockingbird%3C/text%3E%3C/svg%3E"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "sci-fi",
    price: 379,
    description: "A dystopian novel about totalitarianism.",
    stock: 12,
    rating: 4.7,
    discount: 15,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23d32f2f' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3E1984%3C/text%3E%3C/svg%3E"
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "non-fiction",
    price: 599,
    description: "A brief history of humankind.",
    stock: 18,
    rating: 4.6,
    discount: 0,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23F59E0B' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3ESapiens%3C/text%3E%3C/svg%3E"
  },
  {
    id: 5,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    category: "mystery",
    price: 499,
    description: "A thrilling mystery novel set in Sweden.",
    stock: 10,
    rating: 4.4,
    discount: 12,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%231F2937' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EDragon Tattoo%3C/text%3E%3C/svg%3E"
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "romance",
    price: 359,
    description: "A timeless love story with social commentary.",
    stock: 25,
    rating: 4.9,
    discount: 8,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23DB2777' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EPride & Prejudice%3C/text%3E%3C/svg%3E"
  },
  {
    id: 7,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "mystery",
    price: 429,
    description: "A shocking psychological thriller.",
    stock: 14,
    rating: 4.5,
    discount: 10,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23374151' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3ESilent Patient%3C/text%3E%3C/svg%3E"
  },
  {
    id: 8,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "fiction",
    price: 389,
    description: "A magical journey through alternate lives.",
    stock: 16,
    rating: 4.6,
    discount: 0,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%231e293b' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23fbbf24' text-anchor='middle' dy='.3em'%3EMidnight Library%3C/text%3E%3C/svg%3E"
  }
];

exports.addBook = (req, res) => {
  const { title, author, category, price, description, stock, image } = req.body;

  if (!title || !author || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ message: "Missing required book fields" });
  }

  const nextId = books.length > 0 ? Math.max(...books.map((book) => book.id || 0)) + 1 : 1;
  const newBook = {
    id: nextId,
    title,
    author,
    category,
    price: Number(price),
    description: description || "",
    stock: Number(stock),
    rating: 0,
    discount: 0,
    image: image || ""
  };

  books.push(newBook);
  return res.status(201).json(newBook);
};

exports.getBooks = (req, res) => {
  res.json(books);
};

exports.getBookById = (req, res) => {
  const bookId = Number(req.params.id);
  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(book);
};

exports.updateBook = (req, res) => {
  const bookId = Number(req.params.id);
  const bookIndex = books.findIndex((item) => item.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...req.body,
    id: bookId
  };

  return res.json(books[bookIndex]);
};

exports.deleteBook = (req, res) => {
  const bookId = Number(req.params.id);
  const bookIndex = books.findIndex((item) => item.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(bookIndex, 1);
  return res.json({ message: "Book deleted successfully" });
};