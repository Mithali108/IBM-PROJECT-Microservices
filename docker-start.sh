#!/bin/bash
# Docker build and start script for Bookstore App

set -e

echo "=========================================="
echo "Bookstore App - Docker Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker found${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose found${NC}"
echo ""

# Parse arguments
if [ "$1" == "start" ] || [ -z "$1" ]; then
    echo -e "${YELLOW}→ Building and starting all services...${NC}"
    docker-compose up -d --build
    echo ""
    echo -e "${GREEN}✓ All services started!${NC}"
    echo ""
    echo "Service URLs:"
    echo "  Frontend:           http://localhost:8080"
    echo "  API Gateway:        http://localhost:5000"
    echo "  Backend:            http://localhost:5001"
    echo "  Book Service:       http://localhost:5002"
    echo "  Order Service:      http://localhost:5003"
    echo "  User Service:       http://localhost:5004"
    echo "  Notification:       http://localhost:5005"
    echo ""
    echo "View logs with: docker-compose logs -f"
    
elif [ "$1" == "stop" ]; then
    echo -e "${YELLOW}→ Stopping all services...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ All services stopped!${NC}"
    
elif [ "$1" == "logs" ]; then
    docker-compose logs -f ${2:-}
    
elif [ "$1" == "restart" ]; then
    echo -e "${YELLOW}→ Restarting ${2:-all services}...${NC}"
    if [ -z "$2" ]; then
        docker-compose restart
    else
        docker-compose restart $2
    fi
    echo -e "${GREEN}✓ Restarted!${NC}"
    
elif [ "$1" == "clean" ]; then
    echo -e "${YELLOW}→ Cleaning up all containers and volumes...${NC}"
    docker-compose down -v
    echo -e "${GREEN}✓ Cleanup complete!${NC}"
    
elif [ "$1" == "status" ]; then
    echo -e "${YELLOW}→ Service Status:${NC}"
    docker-compose ps
    
elif [ "$1" == "help" ]; then
    echo "Usage: $0 [command] [args]"
    echo ""
    echo "Commands:"
    echo "  start               Build and start all services"
    echo "  stop                Stop all services"
    echo "  logs [service]      View service logs"
    echo "  restart [service]   Restart services"
    echo "  clean               Remove all containers and volumes"
    echo "  status              Show service status"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs api-gateway"
    echo "  $0 restart book-service"
    
else
    echo -e "${RED}Unknown command: $1${NC}"
    echo "Run '$0 help' for usage information"
    exit 1
fi
