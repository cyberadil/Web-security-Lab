# 🔧 Full Setup Guide - Web Security Lab

## Prerequisites Installation

### 1. Install Node.js
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation by opening a new PowerShell window and running:
   ```powershell
   node --version
   npm --version
   ```

### 2. Install MySQL (Optional but Recommended)
1. Download MySQL Community Server from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Or use XAMPP for easier setup: [https://www.apachefriends.org/](https://www.apachefriends.org/)
3. Create a database named `web_security_lab`

## Quick Setup Commands

### Option 1: PowerShell Script (Recommended)
```powershell
# Navigate to project directory
cd "D:\Web security Lab"

# Run the setup script
.\start-server.ps1
```

### Option 2: Manual Setup
```powershell
# Install dependencies
npm install

# Start the server
node server.js
```

### Option 3: Development Mode
```powershell
# Install dependencies
npm install

# Start with auto-restart
npm run dev
```

## Verification Steps

### 1. Check Server Status
Once running, visit these URLs:
- **Main Demo**: http://localhost:3000/
- **Health Check**: http://localhost:3000/health
- **Security Info**: http://localhost:3000/api/security-info

### 2. Test XSS Demo
1. Open http://localhost:3000/
2. Try these payloads:
   ```html
   <script>alert('XSS!')</script>
   <img src="x" onerror="alert('XSS')">
   javascript:alert("XSS")
   ```

### 3. Test SQL Injection Demo
```bash
# Vulnerable endpoint
curl -X POST http://localhost:3000/api/sql/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Secure endpoint
curl -X POST http://localhost:3000/api/sql-secure/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Demo Credentials

### Default Users
- **Username**: `admin` | **Password**: `admin123`
- **Username**: `user1` | **Password**: `password123`
- **Username**: `test` | **Password**: `test123`

## Troubleshooting

### Common Issues

#### 1. Node.js Not Found
**Solution**: Install Node.js from https://nodejs.org/

#### 2. Port Already in Use
**Solution**: Change port in `.env` file or kill existing process
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### 3. Database Connection Failed
**Solution**: 
1. Ensure MySQL is running
2. Check database credentials in `.env` file
3. Create database: `CREATE DATABASE web_security_lab;`

#### 4. PowerShell Execution Policy
**Solution**: Run as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Alternative Setup (No Node.js Required)

If you can't install Node.js immediately, you can still test the XSS demo:

1. **Open the demo hub**: `start-demo.html`
2. **Launch XSS Demo**: Click "Launch Demo" button
3. **Test immediately**: No setup required!

## API Endpoints Reference

### Health & Monitoring
- `GET /health` - Server health check
- `GET /api/security-info` - Security configuration

### XSS Demo
- `POST /api/xss/vulnerable` - Vulnerable endpoint
- `POST /api/xss/secure` - Secure endpoint
- `POST /api/xss/detect` - XSS detection
- `POST /api/xss/sanitize` - Input sanitization

### SQL Injection Demo
- `POST /api/sql/login` - Vulnerable login
- `POST /api/sql-secure/login` - Secure login

### CSRF Protection
- Available as middleware for all POST requests

## Security Features

### Implemented Protections
- ✅ **XSS Prevention**: HTML entity encoding, pattern filtering
- ✅ **SQL Injection Prevention**: Parameterized queries, input validation
- ✅ **CSRF Protection**: Token-based validation, session management
- ✅ **Rate Limiting**: Request throttling, brute force protection
- ✅ **Security Headers**: Helmet.js, CSP, HSTS
- ✅ **Input Validation**: Comprehensive sanitization
- ✅ **Error Handling**: Secure error messages
- ✅ **Logging**: Security event tracking

## Development Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Security audit
npm run test:security

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=web_security_lab
DB_PORT=3306

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Support

If you encounter any issues:

1. **Check the console** for error messages
2. **Verify prerequisites** are installed
3. **Check network connectivity** for external resources
4. **Review logs** in the terminal output

## Author Information

**Mohamed Adil** - Cybersecurity Educator
- Email: officialadil2k5@gmail.com
- Focus: Web Security, Vulnerability Assessment, Secure Coding

---

**⚠️ Remember**: This platform is for educational purposes only. Always implement proper security measures in production applications! 