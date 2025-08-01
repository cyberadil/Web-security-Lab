@echo off
echo 🚀 Starting Web Security Lab Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    echo.
    echo Press any key to open Node.js download page...
    pause >nul
    start https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm.
    exit /b 1
)

echo ✅ npm found
npm --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies.
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo 📝 Creating .env file...
    (
        echo # Web Security Lab Environment Variables
        echo # Created by Mohamed Adil
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=web_security_lab
        echo DB_PORT=3306
        echo.
        echo # Security Configuration
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo SESSION_SECRET=your-super-secret-session-key-change-this-in-production
        echo.
        echo # Rate Limiting
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
        echo.
        echo # Logging
        echo LOG_LEVEL=info
    ) > .env
    echo ✅ .env file created
)

echo.
echo 🌐 Starting server on http://localhost:3000
echo 📊 Health check: http://localhost:3000/health
echo 🔒 Security info: http://localhost:3000/api/security-info
echo 🎯 XSS Demo: http://localhost:3000/
echo 👨‍💻 Author: Mohamed Adil
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
node server.js 