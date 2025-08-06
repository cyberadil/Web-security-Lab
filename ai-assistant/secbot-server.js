/**
 * SecBot AI Assistant - Backend Server
 * A clean, simple Express server for AI chat functionality
 */

const express = require('express');
const cors = require('cors');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
// Allow requests from the frontend running on http://127.0.0.1:5501
const corsOptions = {
    origin: [
        'http://127.0.0.1:5501',
        'http://localhost:5501',
        'http://127.0.0.1:3000',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware Setup
app.use(cors(corsOptions));           // Enable CORS with specific origins
app.use(express.json());              // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes

/**
 * Health Check Endpoint
 * GET /health
 * Returns server status information
 */
app.get('/health', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        service: 'SecBot AI Assistant',
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: 'development'
    };
    
    res.status(200).json(healthStatus);
});

/**
 * Chat Endpoint
 * POST /chat
 * Receives user message and returns AI response
 */
app.post('/chat', (req, res) => {
    try {
        const { message } = req.body;
        
        // Validate input
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                code: 'MISSING_MESSAGE'
            });
        }
        
        if (typeof message !== 'string') {
            return res.status(400).json({
                error: 'Message must be a string',
                code: 'INVALID_MESSAGE_TYPE'
            });
        }
        
        if (message.trim().length === 0) {
            return res.status(400).json({
                error: 'Message cannot be empty',
                code: 'EMPTY_MESSAGE'
            });
        }
        
        // Generate response (Echo functionality as requested)
        const reply = `Echo: ${message.trim()}`;
        
        // Return successful response
        res.status(200).json({
            reply: reply,
            timestamp: new Date().toISOString(),
            messageReceived: message.trim()
        });
        
    } catch (error) {
        console.error('Chat endpoint error:', error);
        
        res.status(500).json({
            error: 'Internal server error',
            code: 'SERVER_ERROR',
            message: 'An error occurred while processing your message'
        });
    }
});

/**
 * API Information Endpoint
 * GET /api/info
 * Returns API documentation and available endpoints
 */
app.get('/api/info', (req, res) => {
    const apiInfo = {
        name: 'SecBot AI Assistant API',
        version: '1.0.0',
        description: 'Backend API for SecBot AI Assistant',
        endpoints: {
            health: {
                method: 'GET',
                path: '/health',
                description: 'Check server health status'
            },
            chat: {
                method: 'POST',
                path: '/chat',
                description: 'Send message to AI assistant',
                requiredFields: ['message'],
                example: {
                    request: { message: 'Hello SecBot!' },
                    response: { reply: 'Echo: Hello SecBot!' }
                }
            }
        },
        cors: {
            allowedOrigins: corsOptions.origin,
            allowedMethods: corsOptions.methods
        }
    };
    
    res.status(200).json(apiInfo);
});

// 404 Handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        code: 'NOT_FOUND',
        message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
        availableEndpoints: ['/health', '/chat', '/api/info']
    });
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    res.status(500).json({
        error: 'Internal server error',
        code: 'GLOBAL_ERROR',
        message: 'An unexpected error occurred'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('🤖 SecBot AI Assistant Server Started');
    console.log('=====================================');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`🔒 Environment: development`);
    console.log(`📡 CORS enabled for: ${corsOptions.origin.join(', ')}`);
    console.log('📋 Available endpoints:');
    console.log(`   GET  /health     - Health check`);
    console.log(`   POST /chat       - Chat with AI`);
    console.log(`   GET  /api/info   - API information`);
    console.log('=====================================');
    console.log('✅ Server ready to accept connections');
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    process.exit(0);
});

// Export app for testing purposes
module.exports = app;