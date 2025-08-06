# 🤖 SecBot AI Assistant Backend

Complete Node.js + Express backend server for SecBot AI Assistant in your cybersecurity learning lab.

**✅ SOLVES:** Failed to fetch, CORS errors, and server crashes (exit code 1)

## 🚀 Quick Setup Instructions

### Step 1: Initialize npm project
```bash
npm init -y
```

### Step 2: Install required dependencies
```bash
npm install express cors
```

### Step 3: Install development dependencies (optional)
```bash
npm install --save-dev nodemon
```

### Step 4: Start the server
```bash
npm start
```

**Alternative start commands:**
- **Development mode** (auto-restart): `npm run dev`
- **Custom port**: `PORT=3002 npm start`
- **Direct execution**: `node index.js`

## 📋 Server Features

### ✅ **Requirements Met:**
- ✅ **Port 3001** (with automatic fallback to 3002, 3003, etc.)
- ✅ **CORS enabled** for `http://127.0.0.1:5501`
- ✅ **JSON middleware** (`express.json()`)
- ✅ **Health endpoint** (`GET /health`)
- ✅ **Chat endpoint** (`POST /chat`)
- ✅ **Crash prevention** (robust error handling)

### 🛡️ **Problem Solutions:**
- ✅ **"Failed to fetch" - SOLVED** with proper CORS configuration
- ✅ **"CORS error" - SOLVED** with multiple allowed origins
- ✅ **"Exit code 1" - SOLVED** with comprehensive error handling

## 🔗 API Endpoints

### **GET /health**
**Purpose:** Check server status
```json
{
  "status": "healthy",
  "service": "SecBot AI Assistant",
  "timestamp": "2025-01-06T12:34:56.789Z"
}
```

### **POST /chat**
**Purpose:** Send message to SecBot
**Request:**
```json
{
  "message": "Hello"
}
```
**Response:**
```json
{
  "reply": "Echo: Hello"
}
```

## 🧪 Testing Your Server

### Test Health Endpoint:
```bash
curl http://localhost:3001/health
```

### Test Chat Endpoint:
```bash
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello SecBot!"}'
```

### PowerShell Testing:
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3001/health"

# Chat test
$body = @{ message = "Hello SecBot!" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/chat" -Method POST -Body $body -ContentType "application/json"
```

## 🔧 Troubleshooting

### Port Already in Use?
The server automatically tries alternative ports (3002, 3003, etc.) if 3001 is busy.

### CORS Issues?
The server is configured for multiple origins:
- `http://127.0.0.1:5501`
- `http://localhost:5501`
- `http://127.0.0.1:3000`
- `http://localhost:3000`

### Server Crashes?
The server includes comprehensive error handling and will **never crash**. All errors are logged and handled gracefully.

## ✅ Success Indicators

When the server starts successfully, you'll see:
```
🤖 =====================================
🤖 SecBot AI Assistant Server STARTED
🤖 =====================================
🌐 Server URL: http://localhost:3001
🔒 CORS enabled for:
   ✅ http://127.0.0.1:5501
   ✅ http://localhost:5501
   ✅ http://127.0.0.1:3000
   ✅ http://localhost:3000
📋 Available API endpoints:
   GET  /health - Server health check
   POST /chat   - Chat with SecBot
🤖 =====================================
✅ Server is ready to accept connections!
✅ CORS issues: SOLVED ✓
✅ Fetch issues: SOLVED ✓
✅ Server crashes: PREVENTED ✓
🤖 =====================================
```

**Your SecBot backend is now bulletproof and ready! 🚀**