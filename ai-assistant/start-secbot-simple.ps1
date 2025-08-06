# Start SecBot Simple Server
# Clean, lightweight Express server for AI Assistant

Write-Host "🤖 Starting SecBot Simple Server..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Stop any existing Node processes
Write-Host "🛑 Stopping existing servers..." -ForegroundColor Yellow
taskkill /IM node.exe /F 2>$null | Out-Null
Start-Sleep -Seconds 2

# Navigate to directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install express cors
}

Write-Host ""
Write-Host "🚀 Starting clean SecBot server..." -ForegroundColor Green
Write-Host "📡 Endpoints:" -ForegroundColor White
Write-Host "   GET  /health     - Server health check" -ForegroundColor Gray
Write-Host "   POST /chat       - Chat with SecBot" -ForegroundColor Gray  
Write-Host "   GET  /api/info   - API documentation" -ForegroundColor Gray

Write-Host ""
Write-Host "🌐 CORS enabled for:" -ForegroundColor White
Write-Host "   http://127.0.0.1:5501" -ForegroundColor Gray
Write-Host "   http://localhost:5501" -ForegroundColor Gray
Write-Host "   http://127.0.0.1:3000" -ForegroundColor Gray
Write-Host "   http://localhost:3000" -ForegroundColor Gray

Write-Host ""

# Try port 3001 first, fallback to 3005
$env:PORT = "3001"
Write-Host "🔌 Attempting to start on port 3001..." -ForegroundColor Cyan

$process = Start-Process -FilePath "node" -ArgumentList "secbot-server.js" -NoNewWindow -PassThru -RedirectStandardOutput "nul" -RedirectStandardError "nul"
Start-Sleep -Seconds 2

# Check if process is still running (port 3001 available)
if ($process.HasExited) {
    Write-Host "⚠️ Port 3001 unavailable, using port 3005..." -ForegroundColor Yellow
    $env:PORT = "3005"
    node secbot-server.js
} else {
    Write-Host "✅ SecBot server running on port 3001" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Test your server:" -ForegroundColor White
    Write-Host "   Health: http://localhost:3001/health" -ForegroundColor Cyan
    Write-Host "   Test Page: Open test-secbot.html in browser" -ForegroundColor Cyan
    
    # Keep the process running
    $process.WaitForExit()
}