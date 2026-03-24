#!/bin/bash
# Local development startup script for macOS/Linux (without Docker)
# This script starts all services locally on your machine

echo ""
echo "=========================================="
echo "Bookstore App - Local Development Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found"

# Parse arguments
command="${1:-start}"

if [ "$command" == "start" ]; then
    echo ""
    echo "Installing dependencies..."
    echo ""
    
    # Install root dependencies
    echo "[1/7] Installing root dependencies..."
    npm install > /dev/null 2>&1
    
    # Install API Gateway dependencies
    echo "[2/7] Installing API Gateway dependencies..."
    cd api-gateway
    npm install > /dev/null 2>&1
    cd ..
    
    # Install Backend dependencies
    echo "[3/7] Installing Backend dependencies..."
    cd Backend
    npm install > /dev/null 2>&1
    cd ..
    
    # Install Book Service dependencies
    echo "[4/7] Installing Book Service dependencies..."
    cd book-service
    npm install > /dev/null 2>&1
    cd ..
    
    # Install Order Service dependencies
    echo "[5/7] Installing Order Service dependencies..."
    cd order-service
    npm install > /dev/null 2>&1
    cd ..
    
    # Install User Service dependencies
    echo "[6/7] Installing User Service dependencies..."
    cd user-service
    npm install > /dev/null 2>&1
    cd ..
    
    # Install Notification Service dependencies
    echo "[7/7] Installing Notification Service dependencies..."
    cd notification-service
    npm install > /dev/null 2>&1
    cd ..
    
    echo ""
    echo "✓ All dependencies installed!"
    echo ""
    echo "Starting services..."
    echo ""
    echo "IMPORTANT: This will start 6 services in different terminal tabs."
    echo "All services will run in the background. Press Ctrl+C to stop all."
    echo ""
    
    # Function to start a service in background
    start_service() {
        local service=$1
        local port=$2
        echo "Starting $service on port $port..."
        
        if [ "$service" == "api-gateway" ]; then
            cd api-gateway && npm start > /tmp/${service}.log 2>&1 &
            cd ..
        elif [ "$service" == "Backend" ]; then
            cd Backend && npm start > /tmp/${service}.log 2>&1 &
            cd ..
        else
            cd $service && npm start > /tmp/${service}.log 2>&1 &
            cd ..
        fi
    }
    
    # Start all services
    start_service "api-gateway" "5000"
    sleep 2
    start_service "Backend" "5000"
    sleep 2
    start_service "book-service" "5002"
    sleep 2
    start_service "order-service" "5003"
    sleep 2
    start_service "user-service" "5004"
    sleep 2
    start_service "notification-service" "5005"
    
    echo ""
    echo "=========================================="
    echo "✓ All services are starting!"
    echo "=========================================="
    echo ""
    echo "Service URLs:"
    echo "  Frontend:               Open Frontend/pages/client/index.html manually"
    echo "  API Gateway:            http://localhost:5000"
    echo "  Backend:                http://localhost:5000"
    echo "  Book Service:           http://localhost:5002"
    echo "  Order Service:          http://localhost:5003"
    echo "  User Service:           http://localhost:5004"
    echo "  Notification Service:   http://localhost:5005"
    echo ""
    echo "View logs:"
    echo "  tail -f /tmp/api-gateway.log"
    echo "  tail -f /tmp/Backend.log"
    echo "  tail -f /tmp/book-service.log"
    echo ""
    echo "To stop all services, press Ctrl+C"
    echo ""
    
    # Wait for user to interrupt
    wait
    
elif [ "$command" == "install" ]; then
    echo "Installing dependencies for all services..."
    npm install
    cd api-gateway && npm install && cd ..
    cd Backend && npm install && cd ..
    cd book-service && npm install && cd ..
    cd order-service && npm install && cd ..
    cd user-service && npm install && cd ..
    cd notification-service && npm install && cd ..
    echo "✓ All dependencies installed!"
    
elif [ "$command" == "help" ]; then
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start               Install dependencies and start all services"
    echo "  install             Only install dependencies"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 install"
    
else
    echo "❌ Unknown command: $command"
    echo "Run '$0 help' for usage information"
    exit 1
fi
