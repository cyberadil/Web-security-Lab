# 🤖 SecBot AI Assistant - Setup Guide

## Overview

SecBot is a ChatGPT-powered AI assistant specialized in web security education. It's designed to help students learn about vulnerabilities, exploits, and security best practices through interactive conversations.

## 🚀 Quick Setup

### Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the API key (starts with `sk-...`)

### Step 2: Install Dependencies

```bash
# Navigate to the ai-assistant directory
cd "d:\Web security Lab - Copy\ai-assistant"

# Install Node.js dependencies
npm install
```

### Step 3: Configure Environment

```bash
# Copy the environment template
copy .env.example .env

# Edit .env file and add your OpenAI API key
# OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Start SecBot Server

```bash
# Option 1: Use the PowerShell script (recommended)
.\start-secbot.ps1

# Option 2: Use npm directly
npm start

# Option 3: Development mode with auto-reload
npm run dev
```

### Step 5: Test Integration

1. Open your Web Security Lab: `start-demo.html`
2. Look for the SecBot chat button in the bottom-right corner
3. Click to open and start chatting about web security!

## 🔧 Configuration Options

### Environment Variables (.env file)

```env
# Required: Your OpenAI API key
OPENAI_API_KEY=sk-your-key-here

# Optional: Server configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Optional: Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Chat settings
MAX_CONVERSATION_HISTORY=10
MAX_MESSAGE_LENGTH=1000
```

## 🎯 Integration Methods

### Method 1: Automatic Integration (Already Done)

Your `start-demo.html` file already includes SecBot integration. Just start the server and it will work automatically.

### Method 2: Manual Widget Integration

Add to any HTML page:

```html
<!-- Include SecBot Integration Script -->
<script src="integrate-secbot.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', async () => {
        await integrateSecBot({
            apiUrl: 'http://localhost:3001/api',
            theme: 'dark'
        });
    });
</script>
```

### Method 3: Standalone Interface

Access the full SecBot interface at: `http://localhost:3001`

## 🛡️ Security Features

- **API Key Protection**: Never exposed to frontend
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Restricts cross-origin requests
- **Input Validation**: Validates message length and format
- **Educational Focus**: Promotes ethical security practices

## 📊 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/chat` | POST | Send message to SecBot |
| `/api/chat/:sessionId` | DELETE | Clear chat session |
| `/api/stats` | GET | Server statistics |

## 🎨 Customization

### Themes

SecBot supports light and dark themes. Toggle using the theme button or set programmatically:

```javascript
// Set theme
document.documentElement.setAttribute('data-theme', 'light');
```

### Custom System Prompt

Edit `server.js` to customize SecBot's behavior:

```javascript
const SYSTEM_PROMPT = `You are SecBot, a specialized Web Security Assistant...`;
```

## 🔍 Troubleshooting

### Common Issues

1. **"SecBot server not running"**
   - Make sure you're in the `ai-assistant` directory
   - Run `npm start` or `.\start-secbot.ps1`
   - Check if port 3001 is available

2. **"OpenAI API key not set"**
   - Create `.env` file from `.env.example`
   - Add your API key: `OPENAI_API_KEY=sk-your-key-here`
   - Restart the server

3. **CORS errors**
   - Check `CORS_ORIGIN` in `.env` matches your frontend URL
   - Default is `http://localhost:3000`

4. **Widget not appearing**
   - Check browser console for errors
   - Ensure `integrate-secbot.js` is loaded
   - Verify server is running on port 3001

### Debug Commands

```bash
# Check if server is running
curl http://localhost:3001/health

# Test chat API
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello SecBot!"}'

# Check server logs
npm start
```

## 📝 Usage Examples

### Basic Questions

- "What is XSS and how can I prevent it?"
- "Explain SQL injection with examples"
- "How does CSRF work?"
- "What are the OWASP Top 10 vulnerabilities?"

### Code Review

- "Review this code for security vulnerabilities: [paste code]"
- "How can I make this authentication more secure?"
- "What's wrong with this SQL query?"

### Learning Scenarios

- "Create a scenario showing how XSS works"
- "Walk me through a SQL injection attack"
- "Explain secure coding best practices"

## 🚀 Production Deployment

For production use:

1. Set `NODE_ENV=production`
2. Use a process manager (PM2)
3. Set up reverse proxy (nginx)
4. Use HTTPS
5. Implement proper logging

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "secbot"
pm2 startup
pm2 save
```

## 📄 File Structure

```
ai-assistant/
├── package.json          # Dependencies and scripts
├── server.js             # Main server file
├── .env.example          # Environment template
├── .env                  # Your environment config
├── public/
│   ├── index.html        # Standalone interface
│   ├── styles.css        # UI styles
│   └── script.js         # Frontend JavaScript
├── logs/                 # Chat logs (auto-created)
├── README.md             # Detailed documentation
└── start-secbot.ps1      # Windows startup script
```

## 🤝 Support

If you encounter issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check server logs and browser console
4. Test API endpoints directly

## 🎓 Educational Use

SecBot is designed for educational purposes:

- ✅ Learn about vulnerabilities
- ✅ Understand prevention techniques
- ✅ Practice secure coding
- ✅ Explore security concepts
- ❌ Don't use for malicious purposes
- ❌ Don't share sensitive production code

---

**Happy Learning with SecBot! 🛡️🤖**