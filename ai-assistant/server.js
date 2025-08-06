const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { getMockResponse, getDemoGuidance } = require('./mock-responses');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI with error handling
let openai = null;
let isOpenAIAvailable = false;

try {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        isOpenAIAvailable = true;
        console.log('✅ OpenAI API initialized successfully');
    } else {
        console.log('⚠️  OpenAI API key not configured - using mock responses');
    }
} catch (error) {
    console.log('⚠️  OpenAI API initialization failed - using mock responses:', error.message);
    isOpenAIAvailable = false;
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    }
});

app.use(limiter);

// CORS configuration - Allow multiple origins for development
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:5501',
    'http://localhost:5501',
    'http://127.0.0.1:3000',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// System prompt for SecBot
const SYSTEM_PROMPT = `You are SecBot, a specialized Web Security Assistant for educational purposes. You are an expert in web application security and help students learn about vulnerabilities and their prevention.

Your expertise includes:
- XSS (Cross-Site Scripting) - all types: reflected, stored, DOM-based
- SQL Injection - various techniques and prevention methods
- CSRF (Cross-Site Request Forgery) - attack vectors and protection mechanisms
- Authentication and Authorization flaws
- OWASP Top 10 vulnerabilities
- Secure coding practices
- Web security testing methodologies

Guidelines for responses:
1. Always provide educational, ethical guidance
2. Explain vulnerabilities with practical examples when appropriate
3. Always include prevention/mitigation strategies
4. Use clear, student-friendly language
5. Encourage responsible disclosure and ethical hacking practices
6. If asked about malicious activities, redirect to educational/defensive approaches
7. Keep responses concise but comprehensive
8. Use code examples when helpful (properly formatted)
9. Reference OWASP guidelines when relevant

Remember: You're helping students learn to BUILD SECURE applications, not exploit them maliciously.`;

// Chat history storage
let chatSessions = new Map();

// Utility function to save chat logs
async function saveChatLog(sessionId, message, response) {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId,
            userMessage: message,
            botResponse: response
        };
        
        const logsDir = path.join(__dirname, 'logs');
        await fs.mkdir(logsDir, { recursive: true });
        
        const logFile = path.join(logsDir, `chat-logs-${new Date().toISOString().split('T')[0]}.json`);
        
        let logs = [];
        try {
            const existingLogs = await fs.readFile(logFile, 'utf8');
            logs = JSON.parse(existingLogs);
        } catch (error) {
            // File doesn't exist or is empty, start with empty array
        }
        
        logs.push(logEntry);
        await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Error saving chat log:', error);
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'SecBot AI Assistant',
        timestamp: new Date().toISOString()
    });
});

// Chat endpoint with fallback to mock responses
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required and must be a string' });
        }
        
        if (message.length > (process.env.MAX_MESSAGE_LENGTH || 1000)) {
            return res.status(400).json({ error: 'Message too long' });
        }
        
        // Get or create chat session
        if (!chatSessions.has(sessionId)) {
            chatSessions.set(sessionId, []);
        }
        
        const conversation = chatSessions.get(sessionId);
        
        // Add user message to conversation
        conversation.push({ role: 'user', content: message });
        
        // Keep conversation history manageable
        const maxHistory = parseInt(process.env.MAX_CONVERSATION_HISTORY) || 10;
        if (conversation.length > maxHistory * 2) { // *2 because each exchange is 2 messages
            conversation.splice(0, conversation.length - maxHistory * 2);
        }
        
        let response;
        let responseSource = 'mock'; // Default to mock
        
        // Try OpenAI first if available
        if (isOpenAIAvailable && openai) {
            try {
                console.log('🤖 Attempting OpenAI API call...');
                
                // Prepare messages for OpenAI
                const messages = [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...conversation
                ];
                
                // Call OpenAI API
                const completion = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 800,
                    temperature: 0.7,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                });
                
                response = completion.choices[0].message.content;
                responseSource = 'openai';
                console.log('✅ OpenAI API call successful');
                
            } catch (apiError) {
                console.error('❌ OpenAI API Error:', apiError.message);
                
                // Fall back to mock response
                response = getMockResponse(message);
                responseSource = 'mock';
                
                // Add demo mode indicator for certain errors
                if (apiError.code === 'insufficient_quota' || apiError.message.includes('quota')) {
                    response = "🤖 **SecBot Demo Mode** - OpenAI API quota exceeded\n\n" + response + "\n\n*💡 Tip: This is a demo response. The full AI assistant requires OpenAI API credits.*";
                } else if (apiError.code === 'rate_limit_exceeded') {
                    response = "🤖 **SecBot Demo Mode** - Rate limit reached\n\n" + response + "\n\n*💡 Tip: API calls are temporarily limited. Using educational responses.*";
                } else {
                    response = "🤖 **SecBot Demo Mode** - API temporarily unavailable\n\n" + response + "\n\n*💡 Tip: Full AI functionality will return when API is available.*";
                }
            }
        } else {
            // Use mock response when OpenAI is not available
            console.log('🎭 Using mock response (OpenAI not available)');
            response = getMockResponse(message);
            response = "🤖 **SecBot Demo Mode** - Educational responses active\n\n" + response + "\n\n*💡 Tip: Configure OpenAI API key for full AI assistant functionality.*";
        }
        
        // Add assistant response to conversation
        conversation.push({ role: 'assistant', content: response });
        
        // Save chat log
        await saveChatLog(sessionId, message, response);
        
        res.json({ 
            response,
            sessionId,
            timestamp: new Date().toISOString(),
            source: responseSource,
            mode: responseSource === 'openai' ? 'ai' : 'demo'
        });
        
    } catch (error) {
        console.error('Chat Endpoint Error:', error);
        
        // Final fallback - always provide a helpful response
        const fallbackResponse = getMockResponse(req.body.message || 'help');
        const enhancedFallback = "🔧 **SecBot Emergency Mode** - System error detected\n\n" + 
                                fallbackResponse + 
                                "\n\n*💡 Tip: If this persists, restart the SecBot server: `npm restart`*";
        
        res.status(200).json({ 
            response: enhancedFallback,
            sessionId: req.body.sessionId || 'default',
            timestamp: new Date().toISOString(),
            source: 'fallback',
            mode: 'emergency'
        });
    }
});

// Clear chat session endpoint
app.delete('/api/chat/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    chatSessions.delete(sessionId);
    res.json({ message: 'Chat session cleared', sessionId });
});

// Get chat statistics
app.get('/api/stats', (req, res) => {
    res.json({
        activeSessions: chatSessions.size,
        totalSessions: Array.from(chatSessions.keys()),
        serverUptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`🤖 SecBot AI Assistant server running on port ${PORT}`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    
    if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️  WARNING: OPENAI_API_KEY not set in environment variables');
    }
});

module.exports = app;