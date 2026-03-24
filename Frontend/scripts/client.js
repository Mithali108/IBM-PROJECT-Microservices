let cart = [];
let allBooks = [];
let booksRefreshTimer = null;

// Default placeholder image
const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23e2e8f0' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%2364748b' text-anchor='middle' dy='.3em'%3EBook Cover%3C/text%3E%3C/svg%3E";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  restoreViewState();
  loadBooks();
  setupEventListeners();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Auto-refresh books every 3 seconds to show admin changes
  booksRefreshTimer = setInterval(loadBooks, 3000);
  
  // Setup cart button
  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }
  
  // Handle modal close on outside click
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) closeCart();
    });
  }
});

function setupEventListeners() {
  const searchBar = document.getElementById("searchBar");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortBy = document.getElementById("sortBy");

  if (searchBar) searchBar.addEventListener("input", filterBooks);
  if (categoryFilter) categoryFilter.addEventListener("change", filterBooks);
  if (priceFilter) {
    priceFilter.addEventListener("input", (e) => {
      const priceValueElement = document.getElementById("priceValue");
      if (priceValueElement) {
        priceValueElement.textContent = `₹0 - ₹${parseInt(e.target.value).toLocaleString('en-IN')}`;
      }
      filterBooks();
    });
  }
  
  // Also add change event for select filters to ensure they work properly
  if (priceFilter) {
    priceFilter.addEventListener("change", filterBooks);
  }
  if (sortBy) sortBy.addEventListener("change", filterBooks);
}

// Load books
async function loadBooks() {
  try {
    const booksData = await fetchBooks();
    if (Array.isArray(booksData)) {
      allBooks = booksData;
      console.log(`✓ Loaded ${allBooks.length} books from API`);
    } else {
      console.warn("API returned non-array data:", booksData);
      allBooks = [];
    }
    // Re-apply active search/filter/sort selections after auto-refresh.
    filterBooks();
  } catch (error) {
    console.error("❌ Error loading books:", error);
    allBooks = [];
    displayBooks([]);
  }
}

function getCurrentViewState() {
  return {
    search: document.getElementById("searchBar")?.value || "",
    category: document.getElementById("categoryFilter")?.value || "",
    maxPrice: document.getElementById("priceFilter")?.value || "1000",
    sortBy: document.getElementById("sortBy")?.value || "newest"
  };
}

function saveViewState() {
  try {
    localStorage.setItem("bookverse-client-view", JSON.stringify(getCurrentViewState()));
  } catch (error) {
    // Ignore localStorage failures in restricted browser modes.
  }
}

function restoreViewState() {
  try {
    const raw = localStorage.getItem("bookverse-client-view");
    if (!raw) return;
    const state = JSON.parse(raw);

    const searchBar = document.getElementById("searchBar");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortBy = document.getElementById("sortBy");
    const priceValueElement = document.getElementById("priceValue");

    if (searchBar && typeof state.search === "string") searchBar.value = state.search;
    if (categoryFilter && typeof state.category === "string") categoryFilter.value = state.category;
    if (priceFilter && state.maxPrice) {
      priceFilter.value = state.maxPrice;
      if (priceValueElement) {
        priceValueElement.textContent = `₹0 - ₹${parseInt(state.maxPrice, 10).toLocaleString("en-IN")}`;
      }
    }
    if (sortBy && typeof state.sortBy === "string") sortBy.value = state.sortBy;
  } catch (error) {
    // Ignore invalid localStorage data.
  }
}

// Display books
function displayBooks(books) {
  const booksGrid = document.getElementById("booksGrid");
  if (!booksGrid) return;

  booksGrid.innerHTML = "";

  if (books.length === 0) {
    booksGrid.innerHTML = `
      <div style='grid-column: 1/-1; text-align: center; padding: 60px 20px;'>
        <i class='fas fa-inbox' style='font-size: 3rem; color: var(--text-light); margin-bottom: 16px;'></i>
        <p style='color: var(--text-light); font-size: 1.1rem;'>No books found. Check back soon! 📚</p>
      </div>
    `;
    return;
  }

  books.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    const discountBadge = book.discount ? `<span class="discount-badge">-${book.discount}%</span>` : '';
    
    bookCard.innerHTML = `
      <div class="book-image">
        ${discountBadge}
        <img src="${book.image}" alt="${book.title}" 
             onerror="this.src='${DEFAULT_IMAGE}'; this.style.opacity='0.7';"
             onload="this.style.opacity='1';"
             style="opacity: 0; transition: opacity 0.3s ease;">
      </div>
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <span class="book-category">
          <i class="fas fa-tag"></i> ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
        </span>
        <p class="book-description">${book.description || "No description available"}</p>
        <div class="book-rating">
          <span class="stars">
            ${'⭐'.repeat(Math.floor(book.rating || 0))}${(book.rating % 1 >= 0.5) ? '⭐' : ''}
          </span>
          <span class="rating-text">${(book.rating || 0).toFixed(1)}/5</span>
        </div>
        <p class="book-stock" style="margin: 8px 0;">
          <i class="fas fa-box"></i> Stock: <strong>${book.stock}</strong> available
        </p>
        <div class="book-price-section">
          <div class="book-price">
            <span class="currency">₹</span>
            <span class="amount">${book.price.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
        </div>
        <div class="book-actions">
          <button class="btn-view-details" onclick="viewBookDetails(${book.id})">
            <i class="fas fa-info-circle"></i> Details
          </button>
          <button class="btn-add-cart" onclick="addToCart(${book.id}, '${book.title.replace(/'/g, "\\'")}', ${book.price})" ${book.stock <= 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i> ${book.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
    booksGrid.appendChild(bookCard);
  });
}

// Filter books
function filterBooks() {
  const searchBar = document.getElementById("searchBar");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortBy = document.getElementById("sortBy");

  // Get filter values
  const searchTerm = (searchBar && searchBar.value) ? searchBar.value.toLowerCase() : "";
  const category = (categoryFilter && categoryFilter.value) ? categoryFilter.value : "";
  const maxPrice = (priceFilter && priceFilter.value) ? parseFloat(priceFilter.value) : Infinity;
  const sortByValue = (sortBy && sortBy.value) ? sortBy.value : "newest";

  saveViewState();

  // Ensure allBooks is an array
  if (!Array.isArray(allBooks)) {
    allBooks = [];
  }

  // Filter books based on search, category, and price
  let filtered = allBooks.filter(book => {
    // Ensure book has required properties
    if (!book || typeof book !== 'object') return false;
    
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    const description = (book.description || "").toLowerCase();
    const bookCategory = book.category || "";
    const bookPrice = book.price || 0;

    const matchesSearch = searchTerm === "" || 
                         title.includes(searchTerm) ||
                         author.includes(searchTerm) ||
                         description.includes(searchTerm);
    
    const matchesCategory = category === "" || bookCategory === category;
    const matchesPrice = bookPrice <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort
  switch(sortByValue) {
    case "price-low":
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "price-high":
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "rating":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "newest":
    default:
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  displayBooks(filtered);
}

// Add to cart
function addToCart(bookId, title, price) {
  const cartItem = cart.find(item => item.id === bookId);
  
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ id: bookId, title, price, quantity: 1 });
  }

  updateCart();
  showNotification(`✓ "${title}" added to cart! (₹${price.toLocaleString('en-IN', {maximumFractionDigits: 0})})`);
}

// Update cart display
function updateCart() {
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--success-color);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideUp 0.3s ease;
    font-weight: 600;
    max-width: 400px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideDown 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// View cart
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      displayCart();
      const cartModal = document.getElementById("cartModal");
      if (cartModal) cartModal.classList.add("active");
    });
  }
});

function displayCart() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div style='text-align: center; padding: 40px 20px;'>
        <i class='fas fa-shopping-cart' style='font-size: 3rem; color: var(--text-light); margin-bottom: 12px;'></i>
        <p style='color: var(--text-light);'>🛒 Your cart is empty</p>
      </div>
    `;
    const cartTotal = document.getElementById("cartTotal");
    if (cartTotal) cartTotal.textContent = "0";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>₹${item.price.toLocaleString('en-IN', {maximumFractionDigits: 0})} × ${item.quantity}</p>
      </div>
      <div style="text-align: right;">
        <p style="font-weight: bold; margin-bottom: 8px; color: var(--success-color); font-size: 1.05rem;">
          ₹${itemTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}
        </p>
        <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-small">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  const cartTotal = document.getElementById("cartTotal");
  if (cartTotal) cartTotal.textContent = total.toLocaleString('en-IN', {maximumFractionDigits: 0});
}

function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  updateCart();
  displayCart();
  showNotification("❌ Item removed from cart");
}

function closeCart() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) cartModal.classList.remove("active");
}

function checkout() {
  if (cart.length === 0) {
    showNotification("❌ Your cart is empty!");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create order
  createOrder({
    customerName: "Guest Customer",
    items: cart,
    total: total
  }).then(response => {
    if (response) {
      showNotification("✓ Order placed successfully! Thank you for your purchase. 🎉");
      cart = [];
      updateCart();
      closeCart();
      loadBooks();
    } else {
      showNotification("❌ Failed to place order. Please try again.");
    }
  });
}

function viewBookDetails(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) {
    showNotification("❌ Book not found!");
    return;
  }

  const details = `
╔════════════════════════════════╗
║      BOOK DETAILS              ║
╚════════════════════════════════╝

📖 Title:           ${book.title}
✍️  Author:          ${book.author}
💰 Price:           ₹${book.price.toLocaleString('en-IN', {maximumFractionDigits: 0})}
📂 Category:        ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
⭐ Rating:          ${(book.rating || 0).toFixed(1)}/5
📦 Stock:           ${book.stock} units

📝 Description:
${book.description}

════════════════════════════════
  `;
  alert(details);
}

function scrollToShop() {
  const shopSection = document.getElementById("shop");
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: "smooth" });
  }
}

function updateDateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById("dateTime");
  if (dateTimeElement) {
    dateTimeElement.textContent = now.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

// ==================== NEW FUNCTIONS FOR REDESIGN ====================

// Open cart modal
function openCart() {
  displayCart();
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.add("show");
  }
}

// Close cart modal
function closeCart() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.remove("show");
  }
}

// Subscribe to newsletter
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  
  if (!email) {
    showToast("Please enter your email", "error");
    return;
  }
  
  // Simulate API call
  setTimeout(() => {
    showToast("✓ Thank you for subscribing! Check your email for offers and updates.", "success");
    event.target.reset();
  }, 1000);
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Display cart with new modal structure
function displayCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <i class="fas fa-shopping-bag" style="font-size: 4rem; color: var(--text-light); margin-bottom: 16px; opacity: 0.5;"></i>
        <h3 style="color: var(--text-light); margin-bottom: 8px;">Your cart is empty</h3>
        <p style="color: var(--text-light);">Add some books to get started!</p>
      </div>
    `;
    if (cartSubtotal) cartSubtotal.textContent = "0";
    if (cartTotal) cartTotal.textContent = "0";
    return;
  }

  let subtotal = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
          <i class="fas fa-book"></i>
        </div>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-author">₹${item.price.toLocaleString('en-IN', {maximumFractionDigits: 0})} each</div>
        <div class="cart-item-controls">
          <button class="btn btn-sm" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span style="padding: 0 12px; font-weight: 600;">${item.quantity}</span>
          <button class="btn btn-sm" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <div style="text-align: right;">
        <div class="cart-item-price">₹${itemTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  if (cartSubtotal) cartSubtotal.textContent = subtotal.toLocaleString('en-IN', {maximumFractionDigits: 0});
  if (cartTotal) cartTotal.textContent = subtotal.toLocaleString('en-IN', {maximumFractionDigits: 0});
}

// Update cart item quantity
function updateQuantity(bookId, change) {
  const cartItem = cart.find(item => item.id === bookId);
  if (cartItem) {
    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
      removeFromCart(bookId);
    } else {
      updateCart();
      displayCart();
    }
  }
}

// Remove from cart
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  updateCart();
  displayCart();
  showToast("Item removed from cart", "success");
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Simulate payment processing
  showToast("Processing your order...", "success");
  
  setTimeout(() => {
    // Simulate order creation
    createOrder({
      customerName: "Guest Customer",
      items: cart,
      total: total
    }).then(response => {
      if (response) {
        showToast("✓ Order placed successfully! Thank you for your purchase. 🎉", "success");
        cart = [];
        updateCart();
        closeCart();
        loadBooks();
      } else {
        showToast("Failed to place order. Please try again.", "error");
      }
    }).catch(error => {
      showToast("Order placed! You will receive a confirmation email soon.", "success");
      cart = [];
      updateCart();
      closeCart();
      loadBooks();
    });
  }, 1500);
}