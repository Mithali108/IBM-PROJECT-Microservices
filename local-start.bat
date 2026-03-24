@echo off
REM Local development startup script for Windows (without Docker)
REM This script starts all services locally on your machine

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Bookstore App - Local Development Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    echo Download from: https://nodejs.org/
    exit /b 1
)

echo ✓ Node.js found

REM Parse arguments
if "%1"=="" (
    set command=start
) else (
    set command=%1
)

if "%command%"=="start" (
    echo.
    echo Installing dependencies...
    echo.
    
    REM Install root dependencies
    echo [1/7] Installing root dependencies...
    call npm install >nul 2>&1
    
    REM Install API Gateway dependencies
    echo [2/7] Installing API Gateway dependencies...
    cd api-gateway
    call npm install >nul 2>&1
    cd ..
    
    REM Install Backend dependencies
    echo [3/7] Installing Backend dependencies...
    cd Backend
    call npm install >nul 2>&1
    cd ..
    
    REM Install Book Service dependencies
    echo [4/7] Installing Book Service dependencies...
    cd book-service
    call npm install >nul 2>&1
    cd ..
    
    REM Install Order Service dependencies
    echo [5/7] Installing Order Service dependencies...
    cd order-service
    call npm install >nul 2>&1
    cd ..
    
    REM Install User Service dependencies
    echo [6/7] Installing User Service dependencies...
    cd user-service
    call npm install >nul 2>&1
    cd ..
    
    REM Install Notification Service dependencies
    echo [7/7] Installing Notification Service dependencies...
    cd notification-service
    call npm install >nul 2>&1
    cd ..
    
    echo.
    echo ✓ All dependencies installed!
    echo.
    echo Starting services...
    echo.
    echo IMPORTANT: This will open 6 new terminal windows.
    echo Close them when done, or use Ctrl+C to stop individual services.
    echo.
    pause
    
    REM Start API Gateway
    start cmd /k "cd api-gateway && npm start"
    timeout /t 2 >nul
    
    REM Start Backend
    start cmd /k "cd Backend && npm start"
    timeout /t 2 >nul
    
    REM Start Book Service
    start cmd /k "cd book-service && npm start"
    timeout /t 2 >nul
    
    REM Start Order Service
    start cmd /k "cd order-service && npm start"
    timeout /t 2 >nul
    
    REM Start User Service
    start cmd /k "cd user-service && npm start"
    timeout /t 2 >nul
    
    REM Start Notification Service
    start cmd /k "cd notification-service && npm start"
    timeout /t 2 >nul
    
    echo.
    echo ========================================
    echo ✓ All services are starting!
    echo ========================================
    echo.
    echo Service URLs:
    echo   Frontend:               No auto-start (open Frontend/pages/client/index.html manually)
    echo   API Gateway:            http://localhost:5000
    echo   Backend:                http://localhost:5000
    echo   Book Service:           http://localhost:5002
    echo   Order Service:          http://localhost:5003
    echo   User Service:           http://localhost:5004
    echo   Notification Service:   http://localhost:5005
    echo.
    echo Services are running in separate windows.
    echo Close each window or press Ctrl+C to stop individual services.
    echo.
    
) else if "%command%"=="install" (
    echo Installing dependencies for all services...
    call npm install
    cd api-gateway && call npm install && cd ..
    cd Backend && call npm install && cd ..
    cd book-service && call npm install && cd ..
    cd order-service && call npm install && cd ..
    cd user-service && call npm install && cd ..
    cd notification-service && call npm install && cd ..
    echo ✓ All dependencies installed!
    
) else if "%command%"=="help" (
    echo Usage: local-start.bat [command]
    echo.
    echo Commands:
    echo   start               Install dependencies and start all services
    echo   install             Only install dependencies
    echo   help                Show this help message
    echo.
    echo Examples:
    echo   local-start.bat start
    echo   local-start.bat install
    
) else (
    echo ❌ Unknown command: %command%
    echo Run "local-start.bat help" for usage information
    exit /b 1
)
