# PowerShell script to start both backend and frontend servers

Write-Host "Starting Backend Server..." -ForegroundColor Green
Set-Location "$PSScriptRoot"
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot
    $env:PORT = "3001"
    npm run dev
}

Start-Sleep -Seconds 3

Write-Host "Checking Backend Status..." -ForegroundColor Yellow
$backendCheck = 0
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ Backend is running on port 3001" -ForegroundColor Green
        $backendCheck = 1
        break
    } catch {
        Write-Host "⏳ Waiting for backend... ($($i + 1)/10)" -ForegroundColor Yellow
    }
}

if ($backendCheck -eq 0) {
    Write-Host "❌ Backend failed to start. Check backend logs." -ForegroundColor Red
    Receive-Job $backendJob
}

Write-Host "`nStarting Frontend Server..." -ForegroundColor Green
Set-Location "$PSScriptRoot\..\frontend"
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PSScriptRoot\..\frontend"
    npm run dev
}

Start-Sleep -Seconds 3

Write-Host "Checking Frontend Status..." -ForegroundColor Yellow
$frontendCheck = 0
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ Frontend is running on port 5173" -ForegroundColor Green
        $frontendCheck = 1
        break
    } catch {
        Write-Host "⏳ Waiting for frontend... ($($i + 1)/10)" -ForegroundColor Yellow
    }
}

if ($frontendCheck -eq 0) {
    Write-Host "❌ Frontend failed to start. Check frontend logs." -ForegroundColor Red
    Receive-Job $frontendJob
}

if ($backendCheck -eq 1 -and $frontendCheck -eq 1) {
    Write-Host "`n✅ Both servers are running!" -ForegroundColor Green
    Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop both servers" -ForegroundColor Yellow
} else {
    Write-Host "`n⚠️  Some servers failed to start. Check the logs above." -ForegroundColor Yellow
}

# Keep jobs running
Wait-Job $backendJob, $frontendJob

