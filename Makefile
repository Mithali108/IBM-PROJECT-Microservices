# Makefile for Bookstore App Docker operations

.PHONY: help build up down logs restart clean status

help:
	@echo "Bookstore App - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build           Build Docker images"
	@echo "  up              Start all services"
	@echo "  down            Stop all services"
	@echo "  restart         Restart all services"
	@echo "  logs            View service logs"
	@echo "  logs-service    View specific service logs (SERVICE=api-gateway)"
	@echo "  clean           Remove containers and volumes"
	@echo "  status          Show service status"
	@echo "  ps              Show running containers"
	@echo "  shell           Open shell in container (SERVICE=api-gateway)"
	@echo ""
	@echo "Examples:"
	@echo "  make up"
	@echo "  make logs"
	@echo "  make logs-service SERVICE=book-service"
	@echo "  make restart"

build:
	@echo "Building Docker images..."
	docker-compose build

up:
	@echo "Starting services..."
	docker-compose up -d --build
	@echo ""
	@echo "✓ Services started!"
	@echo ""
	@echo "URLs:"
	@echo "  Frontend:       http://localhost:8080"
	@echo "  API Gateway:    http://localhost:5000"
	@echo "  Book Service:   http://localhost:5002"

down:
	@echo "Stopping services..."
	docker-compose down
	@echo "✓ Services stopped!"

restart:
	@echo "Restarting services..."
	docker-compose restart
	@echo "✓ Services restarted!"

logs:
	docker-compose logs -f

logs-service:
	docker-compose logs -f $(SERVICE)

ps:
	docker-compose ps

clean:
	@echo "Removing all containers, networks and volumes..."
	docker-compose down -v
	@echo "✓ Cleanup complete!"

status:
	@echo "Service Status:"
	docker-compose ps

shell:
	docker-compose exec $(SERVICE) /bin/sh

.DEFAULT_GOAL := help
