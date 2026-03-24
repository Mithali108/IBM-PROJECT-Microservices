# Bookstore App - Microservices Architecture

A modern, scalable bookstore application built with Node.js microservices and containerized with Docker.

## 🚀 Features

- **Microservices Architecture** - Modular, independent services
- **Docker & Docker Compose** - Easy deployment and scaling
- **API Gateway** - Single entry point for all client requests
- **Book Management** - Manage book catalog
- **Order Processing** - Handle customer orders
- **User Management** - User accounts and authentication
- **Notifications** - Real-time notification service
- **Responsive Frontend** - Modern web interface

## 📋 Project Structure

```
bookstore-app/
├── api-gateway/              # API Gateway Service
├── Backend/                  # Main Backend API
├── book-service/             # Book Management Service
├── order-service/            # Order Management Service
├── user-service/             # User Management Service
├── notification-service/     # Notification Service
├── Frontend/                 # Frontend Application
├── docker-compose.yml        # Docker orchestration
├── .dockerignore             # Docker build excludes
└── DOCKER.md                 # Docker documentation
```

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Git

### Run All Services

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:8080
# API Gateway: http://localhost:5000
```

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

## 🏃 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Install and Run

```bash
# Install root dependencies
npm install

# Install each service
cd api-gateway && npm install && cd ..
cd Backend && npm install && cd ..
cd book-service && npm install && cd ..
cd order-service && npm install && cd ..
cd user-service && npm install && cd ..
cd notification-service && npm install && cd ..
cd Frontend && npm install && cd ..

# Run services individually
# Terminal 1: API Gateway
cd api-gateway && npm start

# Terminal 2: Backend
cd Backend && npm start

# Terminal 3: Book Service
cd book-service && npm start

# Terminal 4: Order Service
cd order-service && npm start

# Terminal 5: User Service
cd user-service && npm start

# Terminal 6: Notification Service
cd notification-service && npm start

# Terminal 7: Frontend
cd Frontend && npm start
```

## 🌐 API Endpoints

### API Gateway (Port 5000)
- Base URL: `http://localhost:5000`

### Book Service (Port 5002)
- Base URL: `http://localhost:5002/api/books`

### Order Service (Port 5003)
- Base URL: `http://localhost:5003/api/orders`

### User Service (Port 5004)
- Base URL: `http://localhost:5004/api/users`

### Notification Service (Port 5005)
- Base URL: `http://localhost:5005/api/notifications`

## 📚 Service Details

### API Gateway
- Handles cross-service communication
- Routes requests to appropriate microservices
- Implements request/response middleware

### Backend (bookstore-api)
- Main API server
- Core business logic
- Database interactions

### Book Service
- CRUD operations for books
- Book search and filtering
- Inventory management

### Order Service
- Order processing
- Order history
- Payment handling

### User Service
- User registration and login
- User profile management
- Authentication & Authorization

### Notification Service
- Email/SMS notifications
- Event-driven notifications
- Notification history

### Frontend
- React-based web interface
- Admin dashboard
- Customer shop interface

## 🛠️ Development with Docker

### View Logs
```bash
docker-compose logs -f api-gateway
```

### Restart a Service
```bash
docker-compose restart book-service
```

### Stop All Services
```bash
docker-compose down
```

### Rebuild a Specific Service
```bash
docker-compose up -d --build book-service
```

More commands available in [DOCKER.md](./DOCKER.md)

## 📦 Technology Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Container**: Docker & Docker Compose
- **Frontend**: HTML/CSS/JavaScript
- **API Communication**: axios, REST

## 🔧 Configuration

### Environment Variables

Each service can be configured via environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
```

For local development, create a `.env` file in each service directory.

## 📝 Docker Commands Cheat Sheet

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Restart service
docker-compose restart [service-name]

# Execute command
docker-compose exec [service-name] npm install [package]

# View running containers
docker-compose ps

# Remove all data
docker-compose down -v
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production` in all services
- [ ] Use environment-specific `.env` files
- [ ] Configure health checks
- [ ] Set resource limits
- [ ] Use dedicated database
- [ ] Setup logging aggregation
- [ ] Configure SSL/TLS
- [ ] Setup monitoring and alerting

See [DOCKER.md](./DOCKER.md) for production deployment guidelines.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Service Not Starting
```bash
docker-compose logs [service-name]
```

### Clean Rebuild
```bash
docker-compose down -v
docker-compose up -d --build
```

For more troubleshooting, see [DOCKER.md](./DOCKER.md#troubleshooting)

## 📖 Documentation

- [Docker Setup Guide](./DOCKER.md) - Comprehensive Docker guide
- [API Documentation](#) - API endpoints and usage
- [Architecture Guide](#) - System design and flow

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

ISC License

## 👨‍💻 Author

BookStore App Team

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review [DOCKER.md](./DOCKER.md)
3. Check individual service logs

---

**Get Started Now**: `docker-compose up -d --build`
