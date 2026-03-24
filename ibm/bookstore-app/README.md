# Bookstore Application

## Overview
This project is a comprehensive bookstore application designed to provide a seamless experience for both clients and administrators. The application features a clean and creative interface, allowing users to browse, search, and purchase books, while providing admins with tools to manage inventory and track sales.

## Project Structure
The project is divided into two main parts: the Frontend and the Backend.

### Frontend
- **index.html**: Main entry point for the frontend application.
- **assets/**: Contains images and fonts used throughout the application.
  - **images/**: Book covers and icons.
  - **fonts/**: Custom fonts for a standardized look.
- **pages/**: Contains separate pages for clients and admins.
  - **client/**: 
    - **index.html**: Homepage for clients.
    - **shop.html**: Displays available books with search and filter options.
    - **book-details.html**: Detailed view of a specific book.
    - **cart.html**: Shopping cart management.
  - **admin/**:
    - **dashboard.html**: Overview of sales and orders.
    - **add-book.html**: Interface for adding new books.
    - **manage-books.html**: Manage existing books (edit/delete).
    - **analytics.html**: View analytics on revenue and purchases.
- **styles/**: Contains CSS files for styling the application.
  - **global.css**: Global styles for consistency.
  - **client.css**: Styles specific to client pages.
  - **admin.css**: Styles specific to admin pages.
- **scripts/**: Contains JavaScript files for functionality.
  - **client.js**: Client-side interactions (searching/filtering).
  - **admin.js**: Admin-side interactions (adding/managing books).
  - **api.js**: API calls to the backend.
  - **utils.js**: Utility functions used across the frontend.

### Backend
- **src/**: Contains the server-side code.
  - **controllers/**: Functions for handling book, order, and admin operations.
    - **bookController.js**: Book-related operations.
    - **orderController.js**: Order-related operations.
    - **adminController.js**: Admin-specific operations.
  - **routes/**: Defines API endpoints.
    - **bookRoutes.js**: Book-related routes.
    - **orderRoutes.js**: Order-related routes.
    - **adminRoutes.js**: Admin-related routes.
  - **models/**: Defines data models for the application.
    - **Book.js**: Book model.
    - **Order.js**: Order model.
    - **User.js**: User model.
  - **middleware/**: Authentication middleware.
    - **auth.js**: User authentication and route protection.
  - **app.js**: Main entry point for the backend application.
- **package.json**: Lists dependencies and scripts for the backend.
- **README.md**: Documentation for the backend application.

## Features
- **Client Features**:
  - Search and filter books by categories.
  - View detailed information about each book.
  - Manage shopping cart for purchases.

- **Admin Features**:
  - Add new books to the inventory.
  - Manage existing books (edit/delete).
  - Track purchases and view total revenue through analytics.

## Getting Started
1. Clone the repository.
2. Navigate to the `Frontend` and `Backend` directories.
3. Install dependencies for the backend using `npm install`.
4. Start the backend server.
5. Open the `Frontend/index.html` in a web browser to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.