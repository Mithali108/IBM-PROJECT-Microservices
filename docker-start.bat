@echo off
REM Docker build and start script for Bookstore App (Windows)

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Bookstore App - Docker Setup
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop.
    exit /b 1
)

echo ✓ Docker found

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed.
    exit /b 1
)

echo ✓ Docker Compose found
echo.

REM Parse arguments
if "%1"=="" (
    set command=start
) else (
    set command=%1
)

if "%command%"=="start" (
    echo → Building and starting all services...
    docker-compose up -d --build
    echo.
    echo ✓ All services started!
    echo.
    echo Service URLs:
    echo   Frontend:           http://localhost:8080
    echo   API Gateway:        http://localhost:5000
    echo   Backend:            http://localhost:5001
    echo   Book Service:       http://localhost:5002
    echo   Order Service:      http://localhost:5003
    echo   User Service:       http://localhost:5004
    echo   Notification:       http://localhost:5005
    echo.
    echo View logs with: docker-compose logs -f
    
) else if "%command%"=="stop" (
    echo → Stopping all services...
    docker-compose down
    echo ✓ All services stopped!
    
) else if "%command%"=="logs" (
    docker-compose logs -f %2
    
) else if "%command%"=="restart" (
    echo → Restarting %2...
    docker-compose restart %2
    echo ✓ Restarted!
    
) else if "%command%"=="clean" (
    echo → Cleaning up all containers and volumes...
    docker-compose down -v
    echo ✓ Cleanup complete!
    
) else if "%command%"=="status" (
    echo → Service Status:
    docker-compose ps
    
) else if "%command%"=="help" (
    echo Usage: docker-start.bat [command] [args]
    echo.
    echo Commands:
    echo   start               Build and start all services
    echo   stop                Stop all services
    echo   logs [service]      View service logs
    echo   restart [service]   Restart services
    echo   clean               Remove all containers and volumes
    echo   status              Show service status
    echo   help                Show this help message
    echo.
    echo Examples:
    echo   docker-start.bat start
    echo   docker-start.bat logs api-gateway
    echo   docker-start.bat restart book-service
    
) else (
    echo ❌ Unknown command: %command%
    echo Run "docker-start.bat help" for usage information
    exit /b 1
)
