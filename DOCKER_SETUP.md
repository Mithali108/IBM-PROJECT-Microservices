# 🐳 Docker Setup Complete!

## What's Been Added

Docker support has been added to your Bookstore App with the following files:

### Docker Configuration Files
- **`docker-compose.yml`** - Orchestrates all 7 services with networking and health checks
- **`Dockerfile`** - Root Dockerfile for main application
- **`.dockerignore`** - Excludes unnecessary files from Docker builds
- **`.env.example`** - Environment variables template

### Individual Service Dockerfiles
- `api-gateway/Dockerfile` - API Gateway service
- `Backend/Dockerfile` - Main backend API
- `book-service/Dockerfile` - Book service
- `order-service/Dockerfile` - Order service
- `user-service/Dockerfile` - User service
- `notification-service/Dockerfile` - Notification service
- `Frontend/Dockerfile` - Frontend service

### Helper Scripts
- **`docker-start.sh`** - Bash script for macOS/Linux
- **`docker-start.bat`** - Batch script for Windows
- **`Makefile`** - Make commands for easy operations

### Documentation
- **`DOCKER.md`** - Comprehensive Docker guide with examples
- **`README_PROJECT.md`** - Full project documentation with Getting Started section

---

## 🚀 Quick Start (Choose One)

### Option 1: Using Docker Compose (Recommended)
```bash
docker-compose up -d --build
```

### Option 2: Using Helper Script

**Windows:**
```bash
docker-start.bat start
```

**macOS/Linux:**
```bash
bash docker-start.sh start
```

### Option 3: Using Make
```bash
make up
```

---

## 📍 Access Your Services

Once running, access your services at:

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:8080 | 8080 |
| API Gateway | http://localhost:5000 | 5000 |
| Backend | http://localhost:5001 | 5001 |
| Book Service | http://localhost:5002 | 5002 |
| Order Service | http://localhost:5003 | 5003 |
| User Service | http://localhost:5004 | 5004 |
| Notification Service | http://localhost:5005 | 5005 |

---

## 📝 Common Commands

```bash
# View all services status
docker-compose ps

# View logs of all services
docker-compose logs -f

# View logs of specific service
docker-compose logs -f api-gateway

# Stop all services
docker-compose down

# Restart a service
docker-compose restart book-service

# Rebuild and restart a service
docker-compose up -d --build book-service

# Execute command in container
docker-compose exec api-gateway npm install express-new-package

# Clean everything (stops containers, removes volumes)
docker-compose down -v
```

---

## 📚 Documentation

- **[DOCKER.md](./DOCKER.md)** - Full Docker documentation with:
  - Detailed setup instructions
  - All Docker commands
  - Development workflow
  - Troubleshooting guide
  - Production deployment tips

- **[README_PROJECT.md](./README_PROJECT.md)** - Project overview and quick start

---

## 🔧 Architecture

All services run in a shared Docker network called `bookstore-network`, allowing them to communicate with each other by service name (e.g., `book-service:5002`).

```
Services communicate via:
- api-gateway → book-service (port 5002)
- api-gateway → order-service (port 5003)
- api-gateway → user-service (port 5004)
- api-gateway → notification-service (port 5005)
- Frontend → api-gateway (port 5000)
```

---

## ⚙️ Prerequisites

- **Docker Desktop** (Windows/Mac) or Docker + Docker Compose (Linux)
- **4GB+ RAM** available for Docker
- **Git** (for cloning)

Install Docker: https://docs.docker.com/desktop/

---

## ✅ Verification

After starting services, verify everything is running:

```bash
docker-compose ps
```

Expected output:
```
NAME                           COMMAND                  SERVICE
bookstore-api-gateway          node api-gateway/...     api-gateway
bookstore-book-service         npm start                book-service
bookstore-order-service        npm start                order-service
bookstore-user-service         npm start                user-service
bookstore-notification-service npm start                notification-service
bookstore-backend              npm start                backend
bookstore-frontend             http-server pages/client frontend
```

---

## 🆘 Troubleshooting

**Services won't start?**
```bash
docker-compose logs api-gateway  # Check what went wrong
```

**Ports already in use?**
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**Want fresh start?**
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📖 Next Steps

1. ✅ Docker setup is complete
2. 🚀 Run `docker-compose up -d --build` to start services
3. 📖 Read [DOCKER.md](./DOCKER.md) for detailed documentation
4. 🔧 See [README_PROJECT.md](./README_PROJECT.md) for project structure
5. 💻 Start developing!

---

## 💡 Tips

- Use **volumes** for development to hot-reload code changes
- Use **health checks** to ensure services are ready
- Check **logs** frequently during development
- Use **docker-compose exec** to run commands in containers
- Keep images small by using **Alpine Linux** base
- Set **resource limits** for memory/CPU in production

---

## 📞 Support

For detailed help:
- Read [DOCKER.md](./DOCKER.md)
- Check service logs: `docker-compose logs service-name`
- Review Docker documentation: https://docs.docker.com/

---

**Happy coding! 🎉**
