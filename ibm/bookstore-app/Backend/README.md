# Bookstore Application Backend

This is the backend for the Bookstore Application, which serves as the API for the frontend client and admin interfaces. The backend is built using Node.js and Express, providing endpoints for managing books, orders, and user authentication.

## Features

- **Book Management**: Add, retrieve, update, and delete books from the inventory.
- **Order Management**: Place orders and track order history.
- **Admin Features**: Admins can manage books and view analytics on total revenue and purchases.
- **User Authentication**: Secure routes with authentication middleware.

## Project Structure

```
Backend
├── src
│   ├── controllers          # Contains logic for handling requests
│   │   ├── bookController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── routes               # Defines API routes
│   │   ├── bookRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── models               # Database models
│   │   ├── Book.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── middleware           # Middleware for authentication
│   │   └── auth.js
│   └── app.js              # Main application file
├── package.json             # Project dependencies and scripts
└── README.md                # Documentation for the backend
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd bookstore-app/Backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **API Documentation**: Refer to the individual route files for details on available endpoints and their usage.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.