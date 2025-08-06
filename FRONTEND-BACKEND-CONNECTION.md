# Frontend-Backend Connection Guide

## ✅ Connection Status: CONNECTED

Your frontend and backend are now properly connected! Here's what was configured:

## 🔧 What Was Done

### 1. Updated XSS Demo Frontend
- Modified `01-XSS-Demo Implementation/frontend/js/xss-demo.js`
- Changed from client-side simulation to real API calls
- Added proper error handling and loading states
- Functions now use `fetch()` to communicate with backend endpoints

### 2. Backend API Endpoints (Already Available)
- **Vulnerable Endpoint**: `POST /api/xss/vulnerable`
- **Secure Endpoint**: `POST /api/xss/secure`
- **Detection Endpoint**: `POST /api/xss/detect`
- **Sanitization Endpoint**: `POST /api/xss/sanitize`

### 3. Server Configuration
- Main server runs on **port 3000**
- AI Assistant runs on **port 3001** 
- Static files are properly served
- CORS is configured for development
- Rate limiting and security headers are active

## 🚀 How to Start Everything

### Option 1: Use the PowerShell Script (Recommended)
```powershell
# Run from the project root directory
.\start-all.ps1
```

### Option 2: Manual Startup
```bash
# Terminal 1: Start main server
npm start

# Terminal 2: Start AI Assistant
cd ai-assistant
npm start
```

### Option 3: Use NPM Scripts
```bash
# Start main server only
npm run start

# Start with development mode (auto-reload)
npm run dev
```

## 🌐 Available URLs

| Service | URL | Description |
|---------|-----|-------------|
| **XSS Demo** | http://localhost:3000/ | Main XSS vulnerability demo |
| **Demo Hub** | http://localhost:3000/demo-hub | All demos overview |
| **Connection Test** | http://localhost:3000/test-connection | Test API connectivity |
| **SQL Injection** | http://localhost:3000/02-SQL-Injection-Demo Implementation/frontend/ | SQL injection demo |
| **CSRF Demo** | http://localhost:3000/03-CSRF-Demo Implementation/frontend/ | CSRF protection demo |
| **E-commerce** | http://localhost:3000/04-E-commerce-Security Implementation/frontend/ | Secure payment demo |
| **Dashboard** | http://localhost:3000/05-Security-Dashboard Implementation/frontend/ | Security monitoring |
| **AI Assistant** | http://localhost:3001/ | ChatGPT-powered security assistant |

## 🔍 Testing the Connection

### 1. Automatic Test Page
Visit: http://localhost:3000/test-connection
- Tests all major API endpoints
- Shows real-time connection status
- Displays detailed logs
- Verifies backend responses

### 2. Manual Testing
1. Start the servers
2. Open http://localhost:3000/
3. Enter test data (e.g., `<script>alert('test')</script>`)
4. Click "Submit (Vulnerable)" - should show unsanitized output
5. Click "Submit (Secure)" - should show sanitized output

### 3. Developer Tools Check
- Open browser Developer Tools (F12)
- Go to Network tab
- Submit forms and verify API calls to `/api/xss/vulnerable` and `/api/xss/secure`

## 📊 API Response Format

### Vulnerable Endpoint Response
```json
{
  "success": true,
  "message": "Message processed",
  "output": "<script>alert('XSS')</script>",
  "vulnerability": "This endpoint is vulnerable to XSS attacks",
  "warning": "This is for educational purposes only"
}
```

### Secure Endpoint Response
```json
{
  "success": true,
  "message": "Message processed securely",
  "originalInput": "<script>alert('XSS')</script>",
  "sanitizedOutput": "&lt;script&gt;alert('XSS')&lt;/script&gt;",
  "security": "Input was sanitized using HTML entity encoding",
  "hadXSS": true
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Connection failed" Error
**Problem**: Frontend can't reach backend
**Solutions**:
- Ensure server is running on port 3000
- Check if another service is using port 3000
- Verify CORS settings in `server.js`

#### 2. API 404 Errors
**Problem**: Endpoints not found
**Solutions**:
- Confirm routes are properly imported in `server.js`
- Check that route files exist in backend directories
- Verify URL paths match exactly

#### 3. CORS Errors
**Problem**: Cross-origin request blocked
**Solutions**:
- Check CORS configuration in `server.js`
- Ensure origin matches your frontend URL
- For development, make sure localhost:3000 is allowed

### Debug Commands
```bash
# Check if server is running
Get-Process node

# Test endpoint manually
curl -X POST http://localhost:3000/api/xss/vulnerable -H "Content-Type: application/json" -d '{"message":"test"}'

# Check server logs
# (Server logs appear in the terminal where you ran npm start)
```

## 📋 Project Structure
```
Web Security Lab/
├── server.js                          # Main backend server
├── package.json                       # Dependencies & scripts
├── start-all.ps1                     # Full stack startup script
├── test-connection.html               # Connection testing page
├── 01-XSS-Demo Implementation/
│   ├── frontend/
│   │   ├── index.html                 # XSS demo UI
│   │   └── js/xss-demo.js            # Updated with API calls
│   └── backend/
│       └── routes/xss-routes.js       # XSS API endpoints
├── 02-SQL-Injection-Demo Implementation/
├── 03-CSRF-Demo Implementation/
├── 04-E-commerce-Security Implementation/
├── 05-Security-Dashboard Implementation/
└── ai-assistant/                      # ChatGPT assistant (port 3001)
```

## ✅ Success Indicators

You'll know everything is working when:
- ✅ No console errors in browser
- ✅ API calls visible in Network tab
- ✅ Backend responses show in frontend
- ✅ Both vulnerable and secure demos work differently
- ✅ Connection test page shows all green checkmarks

## 🎯 Next Steps

1. **Test All Demos**: Visit each demo URL and verify functionality
2. **Explore API Endpoints**: Use the connection test page
3. **Customize Security**: Modify sanitization rules in backend
4. **Add New Features**: Extend API endpoints or frontend functionality
5. **Deploy**: Use the provided Docker configuration for production

---

🔒 **Security Note**: Remember that the "vulnerable" endpoints are intentionally insecure for educational purposes. Never deploy these to production environments.

🚀 **Happy Hacking!** Your Web Security Lab is now fully operational with frontend-backend integration.