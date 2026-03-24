# Local development startup script for Windows (PowerShell)
# Starts all services locally without Docker

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Bookstore App - Local Development Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
$nodeCheck = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Node.js found: $nodeCheck`n" -ForegroundColor Green

# Install dependencies for all services
Write-Host "Installing dependencies for all services...`n" -ForegroundColor Yellow

$services = @(
    @{ name = "Root"; path = "." },
    @{ name = "API Gateway"; path = "api-gateway" },
    @{ name = "Backend"; path = "Backend" },
    @{ name = "Book Service"; path = "book-service" },
    @{ name = "Order Service"; path = "order-service" },
    @{ name = "User Service"; path = "user-service" },
    @{ name = "Notification Service"; path = "notification-service" }
)

$services | ForEach-Object {
    Write-Host "📦 Installing dependencies for $($_.name)..." -ForegroundColor Cyan
    Push-Location $_.path
    npm install --legacy-peer-deps *> $null
    Pop-Location
}

Write-Host "`n✓ All dependencies installed!`n" -ForegroundColor Green

# Start services
Write-Host "Starting services in background...`n" -ForegroundColor Yellow

$serviceStartCommands = @(
    @{ name = "API Gateway"; path = "api-gateway"; port = "5000" },
    @{ name = "Backend"; path = "Backend"; port = "5001" },
    @{ name = "Book Service"; path = "book-service"; port = "5002" },
    @{ name = "Order Service"; path = "order-service"; port = "5003" },
    @{ name = "User Service"; path = "user-service"; port = "5004" },
    @{ name = "Notification Service"; path = "notification-service"; port = "5005" }
)

$jobs = @()

$serviceStartCommands | ForEach-Object {
    $service = $_
    Write-Host "🚀 Starting $($_.name)..." -ForegroundColor Green
    
    $job = Start-Job -ScriptBlock {
        param($path, $serviceName)
        Push-Location $path
        npm start 2>&1 | ForEach-Object { Write-Host "[$serviceName] $_" }
        Pop-Location
    } -ArgumentList $_.path, $_.name
    
    $jobs += $job
    Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ All services are starting!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  API Gateway:            http://localhost:5000" -ForegroundColor White
Write-Host "  Backend:                http://localhost:5001" -ForegroundColor White
Write-Host "  Book Service:           http://localhost:5002" -ForegroundColor White
Write-Host "  Order Service:          http://localhost:5003" -ForegroundColor White
Write-Host "  User Service:           http://localhost:5004" -ForegroundColor White
Write-Host "  Notification Service:   http://localhost:5005" -ForegroundColor White
Write-Host "  Frontend:               Open Frontend/pages/client/index.html in browser`n" -ForegroundColor White

Write-Host "Services are running as background jobs." -ForegroundColor Yellow
Write-Host "To view logs: Get-Job | Receive-Job" -ForegroundColor Yellow
Write-Host "To stop all: Stop-Job -Name 'powershell'" -ForegroundColor Yellow

Write-Host "`nPress Ctrl+C to stop monitoring..." -ForegroundColor Yellow

# Keep script running and show job output
while ($true) {
    $jobs | ForEach-Object {
        if ($_.State -eq "Failed") {
            Write-Host "Job failed: $_" -ForegroundColor Red
        }
    }
    Start-Sleep -Seconds 2
}
