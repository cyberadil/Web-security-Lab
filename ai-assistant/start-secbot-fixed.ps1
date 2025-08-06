# SecBot AI Assistant - Fixed Startup Script
# Resolves OpenAI API quota exceeded issues

Write-Host "🤖 Starting SecBot AI Assistant (Fixed Version)..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Kill any existing node processes to avoid port conflicts
Write-Host "🔄 Stopping existing Node.js processes..." -ForegroundColor Yellow
try {
    taskkill /IM node.exe /F 2>$null
    Start-Sleep -Seconds 2
} catch {
    Write-Host "ℹ️ No existing Node.js processes to stop" -ForegroundColor Gray
}

# Navigate to ai-assistant directory
$aiAssistantPath = "d:\Web security Lab - Copy\ai-assistant"
if (!(Test-Path $aiAssistantPath)) {
    Write-Host "❌ Error: ai-assistant directory not found at $aiAssistantPath" -ForegroundColor Red
    exit 1
}

Set-Location $aiAssistantPath

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check .env file
$envFile = ".env"
if (!(Test-Path $envFile)) {
    Write-Host "⚠️ Creating .env file with demo configuration..." -ForegroundColor Yellow
    @"
# OpenAI API Configuration (Optional - demo mode works without this)
# OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration  
PORT=3002
NODE_ENV=development

# Security Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Chat Configuration
MAX_CONVERSATION_HISTORY=10
MAX_MESSAGE_LENGTH=1000
"@ | Out-File -FilePath $envFile -Encoding UTF8
}

Write-Host ""
Write-Host "🚀 SecBot Features:" -ForegroundColor Green
Write-Host "  ✅ Smart Fallback System" -ForegroundColor Green
Write-Host "  ✅ Educational Demo Responses" -ForegroundColor Green  
Write-Host "  ✅ OpenAI API Support (when available)" -ForegroundColor Green
Write-Host "  ✅ Quota Exceeded Error Handling" -ForegroundColor Green
Write-Host "  ✅ Comprehensive Security Knowledge" -ForegroundColor Green

Write-Host ""
Write-Host "📚 Demo Mode Includes:" -ForegroundColor Magenta
Write-Host "  🔍 XSS Prevention Guide" -ForegroundColor White
Write-Host "  💉 SQL Injection Protection" -ForegroundColor White
Write-Host "  🔄 CSRF Attack Mitigation" -ForegroundColor White
Write-Host "  🛒 E-commerce Security" -ForegroundColor White
Write-Host "  🔒 General Security Best Practices" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Starting SecBot on port 3002..." -ForegroundColor Cyan

# Set port environment variable and start
$env:PORT = "3002"
npm start