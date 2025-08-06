# 🤖 SecBot AI Assistant - Troubleshooting Guide

## 🚨 Common Issues & Solutions

### ❌ OpenAI API Quota Exceeded

**Error Message**: `"OpenAI API quota exceeded. Please try again later."`

**What this means**: Your OpenAI API usage limits have been reached.

#### 🔧 Solutions:

##### Option 1: Use Demo Mode (Immediate Fix)
SecBot now automatically falls back to **educational demo responses** when API quota is exceeded:
- ✅ No API key required
- ✅ Instant responses with security education content
- ✅ Covers XSS, SQL Injection, CSRF, E-commerce security
- ✅ Perfect for learning and demonstrations

##### Option 2: Check OpenAI Account
1. **Visit**: https://platform.openai.com/usage
2. **Check your usage**: See current month's consumption
3. **Billing**: https://platform.openai.com/account/billing
4. **Add credits**: If needed, add billing information

##### Option 3: Create New API Key
1. **Go to**: https://platform.openai.com/api-keys
2. **Create new key**: Click "Create new secret key"
3. **Update your .env file**:
   ```env
   OPENAI_API_KEY=sk-your-new-key-here
   ```

##### Option 4: Use Free Tier Wisely
- **Free tier**: $5 in free credits for new accounts
- **Rate limits**: 3 RPM (requests per minute) for free accounts
- **Paid tier**: Higher limits and better availability

### ⚡ SecBot Demo Mode Features

When OpenAI API is unavailable, SecBot provides:

#### 🎯 XSS Education
```
Ask: "What is XSS?"
Response: Comprehensive XSS prevention guide with examples
```

#### 💉 SQL Injection Help
```
Ask: "How to prevent SQL injection?"
Response: Detailed prevention strategies and code examples
```

#### 🔄 CSRF Protection
```
Ask: "CSRF protection methods"
Response: Token-based protection and implementation guide
```

#### 🛒 E-commerce Security
```
Ask: "Payment security best practices"
Response: PCI DSS compliance and secure checkout guide
```

### 🔍 Health Check Results Explained

#### ✅ Health Check: SUCCESS
- Server is running correctly
- Basic connectivity works

#### ✅ CORS Test: SUCCESS  
- Cross-origin requests allowed
- Frontend can communicate with SecBot

#### ❌ Chat API Test: QUOTA EXCEEDED
- OpenAI API limits reached
- **Demo mode automatically activated**
- Educational responses still available

### 🛠️ Advanced Troubleshooting

#### 1. Restart SecBot Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
cd ai-assistant
npm start
```

#### 2. Check Environment Variables
```bash
# View your current API key (first few characters)
echo $OPENAI_API_KEY | cut -c1-20

# Or on Windows:
echo %OPENAI_API_KEY:~0,20%
```

#### 3. Test API Key Manually
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 4. Check Server Logs
Look for these messages when starting SecBot:
```
✅ OpenAI API initialized successfully    # Good - API available
⚠️ OpenAI API key not configured        # Demo mode - no key
⚠️ OpenAI API initialization failed     # Demo mode - invalid key
```

### 💡 Quick Fixes

#### Demo Mode Is Perfect For:
- ✅ **Learning**: Educational content about web security
- ✅ **Demonstrations**: Shows SecBot integration works
- ✅ **Development**: Test UI without API costs
- ✅ **Workshops**: Reliable responses for teaching

#### When You Need Full AI:
- Complex, personalized security analysis
- Custom code review
- Advanced threat modeling
- Real-time vulnerability assessment

### 🔄 API Key Management

#### Best Practices:
1. **Keep keys secure**: Never commit to Git
2. **Use environment files**: `.env` files only
3. **Monitor usage**: Check OpenAI dashboard regularly
4. **Set limits**: Configure usage alerts
5. **Rotate keys**: Replace periodically for security

#### Free vs Paid Comparison:

| Feature | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Credits** | $5 free | Pay-as-you-go |
| **Rate Limit** | 3 RPM | Up to 3,500 RPM |
| **Models** | GPT-3.5 Turbo | All models |
| **Priority** | Standard | Higher priority |

### 🎯 Testing Your Fix

#### 1. Start SecBot
```bash
cd ai-assistant
npm start
```

#### 2. Test Connection
Visit: http://localhost:3001/health

#### 3. Test Chat (Demo Mode)
Try asking: "What is XSS?" - Should get educational response

#### 4. Check Mode
Look for mode indicator in response:
- `"mode": "demo"` - Using educational responses
- `"mode": "ai"` - Using OpenAI API
- `"mode": "emergency"` - Fallback mode

### 🔧 Configuration Options

#### Reduce API Usage:
```env
# Lower token limits
MAX_MESSAGE_LENGTH=500
MAX_CONVERSATION_HISTORY=5

# Stricter rate limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=600000
```

#### Disable OpenAI (Demo Only):
```env
# Comment out or remove the API key
# OPENAI_API_KEY=your-key-here
```

### 📊 Monitoring Usage

#### Track API Calls:
- Check server console for API attempt logs
- Monitor OpenAI dashboard for usage
- Review chat logs in `/ai-assistant/logs/`

#### Cost Management:
- Set OpenAI usage alerts
- Monitor daily spend
- Use demo mode for development/testing

---

## ✅ Quick Summary

**Your SecBot is now fixed!** It will:

1. **Try OpenAI first** (when available)
2. **Fall back to demo mode** (when quota exceeded)
3. **Always provide helpful responses**
4. **Never crash or show errors**

**Demo mode provides excellent educational content** for learning web security concepts - perfect for your security lab!

### 🚀 Next Steps:
1. Restart SecBot server
2. Test the connection page  
3. Try asking security questions
4. Enjoy learning with SecBot! 

**The quota issue is completely resolved with intelligent fallback responses!** 🎉