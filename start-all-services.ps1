# Simple PowerShell startup script for local development

Write-Host "Starting Bookstore App Services..." -ForegroundColor Cyan

# Check Node.js
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found" -ForegroundColor Red
    exit 1
}

Write-Host "NodeJS Found: $nodeVersion" -ForegroundColor Green

Write-Host "Installing dependencies..." -ForegroundColor Cyan

# Root
Write-Host "npm install (root)..." -ForegroundColor Yellow
npm install --legacy-peer-deps | Out-Null

# API Gateway
Write-Host "npm install (api-gateway)..." -ForegroundColor Yellow
Push-Location api-gateway
npm install --legacy-peer-deps | Out-Null
Pop-Location

# Backend  
Write-Host "npm install (Backend)..." -ForegroundColor Yellow
Push-Location Backend
npm install --legacy-peer-deps | Out-Null
Pop-Location

# Book Service
Write-Host "npm install (book-service)..." -ForegroundColor Yellow
Push-Location book-service
npm install --legacy-peer-deps | Out-Null
Pop-Location

# Order Service
Write-Host "npm install (order-service)..." -ForegroundColor Yellow
Push-Location order-service
npm install --legacy-peer-deps | Out-Null
Pop-Location

# User Service
Write-Host "npm install (user-service)..." -ForegroundColor Yellow
Push-Location user-service
npm install --legacy-peer-deps | Out-Null
Pop-Location

# Notification Service
Write-Host "npm install (notification-service)..." -ForegroundColor Yellow
Push-Location notification-service
npm install --legacy-peer-deps | Out-Null
Pop-Location

Write-Host "Starting all services..." -ForegroundColor Green

# Start each service in a background job
Start-Job -Name "API-Gateway" -ScriptBlock { Push-Location api-gateway; npm start }
Start-Job -Name "Backend" -ScriptBlock { Push-Location Backend; npm start }
Start-Job -Name "Book-Service" -ScriptBlock { Push-Location book-service; npm start }
Start-Job -Name "Order-Service" -ScriptBlock { Push-Location order-service; npm start }
Start-Job -Name "User-Service" -ScriptBlock { Push-Location user-service; npm start }
Start-Job -Name "Notification-Service" -ScriptBlock { Push-Location notification-service; npm start }

Write-Host "`n" -ForegroundColor Green
Write-Host "Services started in background!" -ForegroundColor Green
Write-Host "`nService URLs:" -ForegroundColor Cyan
Write-Host "  API Gateway:          http://localhost:5000" -ForegroundColor White
Write-Host "  Book Service:         http://localhost:5002" -ForegroundColor White
Write-Host "  Order Service:        http://localhost:5003" -ForegroundColor White
Write-Host "  User Service:         http://localhost:5004" -ForegroundColor White
Write-Host "  Notification Service: http://localhost:5005" -ForegroundColor White
Write-Host "`nOpen Frontend/pages/client/index.html in your browser" -ForegroundColor Yellow

Write-Host "`nTo view service logs: Get-Job | Receive-Job" -ForegroundColor Yellow
Write-Host "To stop all services: Stop-Job -Name *" -ForegroundColor Yellow
