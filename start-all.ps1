# Web Security Lab - Full Stack Startup Script
# Created by Mohamed Adil

Write-Host "🚀 Starting Web Security Lab..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install dependencies if needed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Installing main dependencies..." -ForegroundColor Yellow
    npm install
}

# Check AI Assistant dependencies
if (!(Test-Path "ai-assistant/node_modules")) {
    Write-Host "Installing AI Assistant dependencies..." -ForegroundColor Yellow
    Set-Location "ai-assistant"
    npm install
    Set-Location ".."
}

# Start the main server
Write-Host "🔥 Starting Main Server (Port 3000)..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Start main server in background
$mainServer = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
Write-Host "✅ Main Server started (PID: $($mainServer.Id))" -ForegroundColor Green

# Wait a moment for server to start
Start-Sleep -Seconds 2

# Start AI Assistant in background
Write-Host "🤖 Starting AI Assistant (Port 3001)..." -ForegroundColor Cyan
$aiServer = Start-Process -FilePath "node" -ArgumentList "ai-assistant/server.js" -PassThru -NoNewWindow
Write-Host "✅ AI Assistant started (PID: $($aiServer.Id))" -ForegroundColor Cyan

# Wait for servers to fully initialize
Start-Sleep -Seconds 3

Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 All Services Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "📊 Available Services:" -ForegroundColor White
Write-Host "🌐 Main Demo Hub: http://localhost:3000/" -ForegroundColor Cyan
Write-Host "🔍 XSS Demo: http://localhost:3000/" -ForegroundColor Yellow
Write-Host "💉 SQL Injection: http://localhost:3000/02-SQL-Injection-Demo Implementation/frontend/" -ForegroundColor Yellow
Write-Host "🛡️ CSRF Demo: http://localhost:3000/03-CSRF-Demo Implementation/frontend/" -ForegroundColor Yellow
Write-Host "🛒 E-commerce: http://localhost:3000/04-E-commerce-Security Implementation/frontend/" -ForegroundColor Yellow
Write-Host "📈 Dashboard: http://localhost:3000/05-Security-Dashboard Implementation/frontend/" -ForegroundColor Yellow
Write-Host "🤖 AI Assistant: http://localhost:3001/" -ForegroundColor Magenta

Write-Host ""
Write-Host "🔧 API Endpoints:" -ForegroundColor White
Write-Host "   /health - Health check" -ForegroundColor Gray
Write-Host "   /api/security-info - Security information" -ForegroundColor Gray
Write-Host "   /api/xss/* - XSS demo endpoints" -ForegroundColor Gray
Write-Host "   /api/sql/* - SQL injection endpoints" -ForegroundColor Gray

Write-Host ""
Write-Host "⚡ Quick Commands:" -ForegroundColor White
Write-Host "   Ctrl+C - Stop servers" -ForegroundColor Gray
Write-Host "   Check server status: Get-Process node" -ForegroundColor Gray

Write-Host ""
Write-Host "🌐 Opening demo hub in your browser..." -ForegroundColor Green
Start-Process "http://localhost:3000/"

Write-Host ""
Write-Host "Press Ctrl+C to stop all servers..." -ForegroundColor Yellow

# Keep script running to manage servers
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if processes are still running
        if (!$mainServer -or $mainServer.HasExited) {
            Write-Host "❌ Main server stopped unexpectedly" -ForegroundColor Red
            break
        }
        
        if (!$aiServer -or $aiServer.HasExited) {
            Write-Host "❌ AI Assistant stopped unexpectedly" -ForegroundColor Red
            break
        }
    }
} finally {
    # Cleanup on exit
    Write-Host ""
    Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
    
    if ($mainServer -and !$mainServer.HasExited) {
        Stop-Process -Id $mainServer.Id -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Main server stopped" -ForegroundColor Green
    }
    
    if ($aiServer -and !$aiServer.HasExited) {
        Stop-Process -Id $aiServer.Id -Force -ErrorAction SilentlyContinue  
        Write-Host "✅ AI Assistant stopped" -ForegroundColor Green
    }
    
    Write-Host "👋 Goodbye!" -ForegroundColor Cyan
}