# PowerShell script to start the backend server
# This script checks for PostgreSQL and provides helpful error messages

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found" -ForegroundColor Yellow
    Write-Host "   Creating .env.example template..." -ForegroundColor Gray
    
    $envContent = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hr_management

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=24h
"@
    
    Set-Content -Path ".env.example" -Value $envContent
    Write-Host "   Please create .env file from .env.example and update with your credentials" -ForegroundColor Yellow
    Write-Host ""
}

# Check PostgreSQL connection
Write-Host "📊 Checking PostgreSQL connection..." -ForegroundColor Cyan
$pgCheck = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue -InformationLevel Quiet -ErrorAction SilentlyContinue

if (-not $pgCheck) {
    Write-Host ""
    Write-Host "❌ PostgreSQL is not running on port 5432" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Start PostgreSQL service:" -ForegroundColor White
    Write-Host "      Get-Service | Where-Object Name -like '*postgres*'" -ForegroundColor Gray
    Write-Host "      Start-Service postgresql-x64-15" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   2. Or start from Services (Win+R -> services.msc)" -ForegroundColor White
    Write-Host ""
    Write-Host "   3. Install PostgreSQL if not installed:" -ForegroundColor White
    Write-Host "      https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    
    $response = Read-Host "Do you want to continue anyway? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ PostgreSQL is accessible on port 5432" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Starting backend server..." -ForegroundColor Cyan
Write-Host ""

# Start the server
npm run dev

