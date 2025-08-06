# 🚀 SecBot AI Assistant - Complete Setup Guide

## 📋 How to Start the Server

Follow these steps to get your SecBot AI Assistant backend running:

### Step 1: Navigate to the Project Directory
```bash
cd "d:\Web security Lab - Copy\ai-assistant"
```

### Step 2: Initialize npm (if needed)
```bash
npm init -y
```

### Step 3: Install Dependencies
```bash
npm install express cors
```

### Step 4: Install Development Dependencies (Optional)
```bash
npm install --save-dev nodemon
```

### Step 5: Start the Server
```bash
npm start
```

**Alternative start methods:**
- **Development mode** (auto-restart): `npm run dev`
- **Custom port**: `PORT=3008 npm start`
- **Direct**: `node index.js`

---

## ✅ Server Verification

### Expected Output:
```
🤖 =================================
🤖 SecBot AI Assistant Server
🤖 =================================
🌐 Server running at: http://localhost:3001
🔒 CORS enabled for: http://127.0.0.1:5501
📋 Available endpoints:
   GET  /health - Health check
   POST /chat   - Chat with SecBot
🤖 =================================
✅ Server ready to accept requests!
```

### Test the Server:

#### 1. Health Check Test
```bash
curl http://localhost:3001/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "service": "SecBot AI Assistant",
  "timestamp": "2025-01-06T12:34:56.789Z"
}
```

#### 2. Chat API Test
```bash
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello SecBot!"}'
```
**Expected Response:**
```json
{
  "reply": "Echo: Hello SecBot!"
}
```

#### 3. PowerShell Testing (Windows)
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3001/health"

# Chat test
$body = @{ message = "Hello SecBot!" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/chat" -Method POST -Body $body -ContentType "application/json"
```

---

## 🔧 Troubleshooting

### Problem: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3001`

**Solutions:**
1. **Kill existing process:**
   ```bash
   # Find process using port 3001
   netstat -ano | findstr :3001
   
   # Kill the process (replace PID)
   taskkill /PID <process_id> /F
   ```

2. **Use different port:**
   ```bash
   PORT=3008 npm start
   ```

### Problem: CORS Issues
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:** Make sure your frontend is running on exactly `http://127.0.0.1:5501`

### Problem: Dependencies Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install express cors
```

---

## 📁 Project Structure
```
ai-assistant/
├── index.js              # Main server file ✅
├── package.json          # Node.js configuration ✅
├── package-lock.json     # Dependency lock file
├── node_modules/         # Dependencies (auto-generated)
├── README.md            # Documentation
├── SETUP-INSTRUCTIONS.md # This file
└── start-server.bat     # Windows batch file to start server
```

---

## 🎯 Complete Server Features

### ✅ **Requirements Met:**
- ✅ **Port 3001** (configurable via PORT environment variable)
- ✅ **CORS enabled** for `http://127.0.0.1:5501`
- ✅ **JSON middleware** (`express.json()` included)
- ✅ **Health endpoint** (`GET /health`)
- ✅ **Chat endpoint** (`POST /chat` with echo functionality)
- ✅ **Clear comments** and readable code structure

### 🚀 **Additional Features:**
- ✅ **Input validation** for chat messages
- ✅ **Error handling** for all endpoints
- ✅ **Request logging** for debugging
- ✅ **Graceful shutdown** handling
- ✅ **404 handler** for undefined routes
- ✅ **Environment variable support** for port configuration

---

## 📚 API Documentation

### Endpoints:

#### `GET /health`
- **Purpose:** Server health check
- **Response:** JSON with status, service name, and timestamp
- **Status Codes:** 200 (OK)

#### `POST /chat`
- **Purpose:** Send message to SecBot
- **Request Body:** `{ "message": "your message here" }`
- **Response:** `{ "reply": "Echo: your message here" }`
- **Status Codes:** 200 (OK), 400 (Bad Request), 500 (Server Error)

#### Error Responses:
- **400 Bad Request:** Invalid or missing message
- **404 Not Found:** Endpoint doesn't exist
- **500 Server Error:** Unexpected server error

---

## 🎉 Success!

Your SecBot AI Assistant backend server is now ready! 

**Next Steps:**
1. Start the server using `npm start`
2. Test the endpoints using curl or PowerShell
3. Integrate with your frontend application
4. Build your cybersecurity learning lab features!

**Happy Learning! 🤖🔒**