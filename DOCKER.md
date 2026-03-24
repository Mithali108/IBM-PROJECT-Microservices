# Docker Setup Guide for Bookstore App

## Overview

This project uses Docker and Docker Compose to containerize all microservices and the frontend. The architecture includes:

- **API Gateway** (Port 5000): Main entry point for all requests
- **Backend** (Port 5001): Main backend API
- **Book Service** (Port 5002): Manages book catalog
- **Order Service** (Port 5003): Handles order operations
- **User Service** (Port 5004): Manages user accounts
- **Notification Service** (Port 5005): Handles notifications
- **Frontend** (Port 8080): React/Static file server

## Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
- Git
- At least 4GB of RAM available for Docker

**Installation:**
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker for Linux](https://docs.docker.com/engine/install/ubuntu/)

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d --build
```

This command:
- Builds Docker images for all services
- Starts all containers
- Creates a shared network for service communication
- Runs in detached mode (background)

### 2. Verify Services Are Running

```bash
docker-compose ps
```

You should see all services with status "Up".

### 3. Access the Application

- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:5000
- **Backend**: http://localhost:5001
- **Book Service**: http://localhost:5002

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway

# Last 50 lines
docker-compose logs --tail=50
```

### Rebuild Images
```bash
docker-compose up -d --build
```

### Remove Everything (Containers, Networks, Volumes)
```bash
docker-compose down -v
```

### Restart a Service
```bash
docker-compose restart book-service
```

### Execute Command in Container
```bash
docker-compose exec api-gateway npm install <package>
```

## Development Workflow

### Run in Development Mode

For development, you may want to modify services individually:

```bash
# Terminal 1: Start supporting services
docker-compose up -d book-service order-service user-service notification-service

# Terminal 2: Run API Gateway locally (outside Docker)
cd api-gateway
npm install
npm start
```

### View Service Logs

```bash
# Follow logs of multiple services
docker-compose logs -f api-gateway book-service

# View logs from last hour
docker-compose logs --since 1h
```

### Update Dependencies

```bash
# Install new package in container and update package-lock.json
docker-compose exec book-service npm install <package>

# Then rebuild the image
docker-compose up -d --build book-service
```

## Environment Variables

Each service can use environment variables defined in `docker-compose.yml`. To override:

### Create a `.env` file:
```
NODE_ENV=development
PORT=5000
```

### Use environment file:
```bash
docker-compose --env-file=.env.development up -d
```

## Troubleshooting

### Ports Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill process on Windows
taskkill /PID <PID> /F

# Kill process on Mac/Linux
kill -9 <PID>
```

### Service Exits Immediately

Check logs:
```bash
docker-compose logs book-service
```

Common causes:
- Missing dependencies (run `npm install` in that service)
- Port already in use
- Environment variables not set correctly

### Memory Issues

Increase Docker Desktop memory allocation:
1. Docker Desktop → Preferences → Resources → Memory (set to 4GB+)

### Rebuild Specific Service

```bash
docker-compose build --no-cache book-service
docker-compose up -d book-service
```

### Clean Up Everything

```bash
# Stop all containers
docker-compose down

# Remove all images built by compose
docker-compose down --rmi all

# Remove all volumes
docker-compose down -v

# Total cleanup (use with caution)
docker system prune -a
```

## Production Deployment

### Security Best Practices

1. Use secrets for sensitive data:
```yaml
secrets:
  db_password:
    external: true
```

2. Set `NODE_ENV=production`

3. Use specific image versions (not `latest`)

4. Run containers as non-root user

5. Set resource limits:
```yaml
services:
  book-service:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Scaling Services

For multiple instances of a service:
```bash
docker-compose up -d --scale book-service=3
```

However, you'll need to use a load balancer for port mapping.

## File Structure

```
bookstore-app/
├── docker-compose.yml      # Orchestration config
├── .dockerignore          # Files to exclude from builds
├── api-gateway/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── Backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── book-service/
│   ├── Dockerfile
│   └── package.json
├── order-service/
│   ├── Dockerfile
│   └── package.json
├── user-service/
│   ├── Dockerfile
│   └── package.json
├── notification-service/
│   ├── Dockerfile
│   └── package.json
└── Frontend/
    ├── Dockerfile
    ├── package.json
    └── pages/
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                            │
│                   (bookstore-network)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                                            │
│  │   Frontend   │                                            │
│  │   :8080      │                                            │
│  └──────────────┘                                            │
│          │                                                    │
│          ▼                                                    │
│  ┌──────────────────┐                                        │
│  │  API Gateway     │                                        │
│  │  :5000           │                                        │
│  └──────────────────┘                                        │
│    │      │      │      │                                    │
│    ▼      ▼      ▼      ▼                                    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌──────────────┐                  │
│  │ BS  │ │ OS  │ │ US  │ │   Notif      │                  │
│  │ 5002│ │ 5003│ │ 5004│ │   5005       │                  │
│  └─────┘ └─────┘ └─────┘ └──────────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘

BS  = Book Service
OS  = Order Service
US  = User Service
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Node.js Docker Images](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker CLI Commands](https://docs.docker.com/engine/reference/commandline/docker/)

## Support

For issues or questions:
1. Check service logs: `docker-compose logs <service-name>`
2. Verify services: `docker-compose ps`
3. Check Docker daemon: `docker ps`
