# SecBot AI Assistant Startup Script
# PowerShell script to start the SecBot server with proper configuration

Write-Host "🤖 Starting SecBot AI Assistant..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Please run this script from the ai-assistant directory." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "📝 Created .env file from template" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env file and add your OpenAI API key!" -ForegroundColor Yellow
        Write-Host "   OPENAI_API_KEY=your_openai_api_key_here" -ForegroundColor Yellow
        
        # Ask if user wants to continue
        $continue = Read-Host "Do you want to continue without API key? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "Please add your OpenAI API key to .env file and run this script again." -ForegroundColor Yellow
            exit 0
        }
    } else {
        Write-Host "❌ .env.example file not found" -ForegroundColor Red
        exit 1
    }
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Check if port 3001 is available
try {
    $portCheck = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($portCheck) {
        Write-Host "⚠️  Port 3001 is already in use" -ForegroundColor Yellow
        Write-Host "The SecBot server might already be running, or another service is using this port." -ForegroundColor Yellow
        
        $continue = Read-Host "Do you want to continue anyway? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            exit 0
        }
    }
} catch {
    # Port check failed, but that's okay - continue
}

# Create logs directory if it doesn't exist
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "📁 Created logs directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting SecBot server..." -ForegroundColor Green
Write-Host "   Server will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Widget integration example: http://localhost:3001/widget-integration.html" -ForegroundColor Cyan
Write-Host "   Health check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Cyan

# Start the server
npm start