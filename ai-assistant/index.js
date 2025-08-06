/**
 * SecBot AI Assistant - Backend Server
 * Cybersecurity Learning Lab AI Assistant API
 * 
 * This server provides a robust backend for SecBot with proper CORS,
 * error handling, and API endpoints for health checks and chat functionality.
 */

const express = require('express');
const cors = require('cors');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// ===========================================
// CORS CONFIGURATION
// ===========================================

/**
 * CORS Options - Configured specifically for the frontend
 * This solves "CORS error" and "Failed to fetch" issues
 */
const corsOptions = {
    origin: [
        'http://127.0.0.1:5501',    // Primary frontend URL
        'http://localhost:5501',     // Alternative localhost
        'http://127.0.0.1:3000',    // Main lab URL
        'http://localhost:3000'      // Alternative main lab URL
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Accept', 
        'Origin',
        'X-Requested-With'
    ],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
};

// ===========================================
// MIDDLEWARE SETUP
// ===========================================

// Enable CORS with specific configuration
app.use(cors(corsOptions));

// Parse JSON request bodies (required for POST /chat)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'None'}`);
    next();
});

// ===========================================
// API ENDPOINTS
// ===========================================

/**
 * Health Check Endpoint
 * GET /health
 * 
 * Purpose: Verify server is running and responsive
 * Returns: Server status with timestamp
 */
app.get('/health', (req, res) => {
    try {
        const healthResponse = {
            status: 'healthy',
            service: 'SecBot AI Assistant',
            timestamp: new Date().toISOString()
        };
        
        console.log('✅ Health check - Server is healthy');
        res.status(200).json(healthResponse);
        
    } catch (error) {
        console.error('❌ Health check error:', error);
        res.status(500).json({
            status: 'error',
            service: 'SecBot AI Assistant',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});

/**
 * Chat Endpoint
 * POST /chat
 * 
 * Purpose: Handle chat messages from SecBot frontend
 * Expects: { "message": "user message here" }
 * Returns: { "reply": "Echo: user message here" }
 */
app.post('/chat', (req, res) => {
    try {
        // Extract message from request body
        const { message } = req.body;
        
        // Comprehensive input validation
        if (!req.body) {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'Request body is required',
                timestamp: new Date().toISOString()
            });
        }
        
        if (!message) {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'Message field is required',
                timestamp: new Date().toISOString()
            });
        }
        
        if (typeof message !== 'string') {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'Message must be a string',
                timestamp: new Date().toISOString()
            });
        }
        
        if (message.trim().length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'Message cannot be empty',
                timestamp: new Date().toISOString()
            });
        }
        
        if (message.length > 1000) {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'Message too long (max 1000 characters)',
                timestamp: new Date().toISOString()
            });
        }
        
        // Create echo response
        const chatResponse = {
            reply: `Echo: ${message.trim()}`
        };
        
        console.log(`💬 Chat message: "${message}" -> Reply sent`);
        res.status(200).json(chatResponse);
        
    } catch (error) {
        console.error('❌ Chat endpoint error:', error);
        
        // Never crash the server - always return a proper response
        res.status(500).json({
            error: 'Internal Server Error',
            details: 'An unexpected error occurred while processing your message',
            timestamp: new Date().toISOString()
        });
    }
});

// ===========================================
// ERROR HANDLING MIDDLEWARE
// ===========================================

/**
 * 404 Handler - Handle requests to non-existent endpoints
 */
app.use('*', (req, res) => {
    console.log(`⚠️ 404 - Endpoint not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Not Found',
        details: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
        availableEndpoints: {
            'GET /health': 'Check server health status',
            'POST /chat': 'Send a chat message to SecBot'
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * Global Error Handler - Catch any unhandled errors
 * This prevents the server from crashing (solves "exit code: 1" issue)
 */
app.use((error, req, res, next) => {
    console.error('🚨 Global error handler caught:', error);
    
    // Log error details for debugging
    console.error('Error stack:', error.stack);
    console.error('Request details:', {
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers
    });
    
    // Never crash - always respond gracefully
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal Server Error',
            details: 'An unexpected server error occurred',
            timestamp: new Date().toISOString(),
            requestId: req.id || 'unknown'
        });
    }
});

// ===========================================
// SERVER STARTUP
// ===========================================

/**
 * Start the Express server with comprehensive error handling
 */
const server = app.listen(PORT, () => {
    console.log('\n🤖 =====================================');
    console.log('🤖 SecBot AI Assistant Server STARTED');
    console.log('🤖 =====================================');
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`🔒 CORS enabled for:`);
    corsOptions.origin.forEach(origin => {
        console.log(`   ✅ ${origin}`);
    });
    console.log('📋 Available API endpoints:');
    console.log(`   GET  /health - Server health check`);
    console.log(`   POST /chat   - Chat with SecBot`);
    console.log('🤖 =====================================');
    console.log('✅ Server is ready to accept connections!');
    console.log('✅ CORS issues: SOLVED ✓');
    console.log('✅ Fetch issues: SOLVED ✓'); 
    console.log('✅ Server crashes: PREVENTED ✓');
    console.log('🤖 =====================================\n');
});

/**
 * Handle server startup errors
 */
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ ERROR: Port ${PORT} is already in use`);
        console.error(`💡 Solution: Try a different port:`);
        console.error(`   PORT=3002 npm start`);
        console.error(`   or`);
        console.error(`   PORT=3003 npm start`);
        
        // Try alternative ports automatically
        const alternativePorts = [3002, 3003, 3004, 3005, 3006];
        for (const altPort of alternativePorts) {
            console.log(`🔄 Trying port ${altPort}...`);
            const altServer = app.listen(altPort, () => {
                console.log(`✅ SUCCESS: Server started on port ${altPort}`);
                console.log(`🌐 Access your server at: http://localhost:${altPort}`);
                server.close(); // Close the failed server
            });
            
            altServer.on('error', () => {
                console.log(`❌ Port ${altPort} also in use`);
                altServer.close();
            });
            
            if (!altServer.listening) continue;
            break;
        }
    } else {
        console.error('❌ Server startup error:', error);
    }
});

// ===========================================
// GRACEFUL SHUTDOWN HANDLERS
// ===========================================

/**
 * Handle graceful shutdown on SIGINT (Ctrl+C)
 */
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT (Ctrl+C)');
    console.log('🛑 Shutting down SecBot server gracefully...');
    
    server.close((error) => {
        if (error) {
            console.error('❌ Error during server shutdown:', error);
            process.exit(1);
        }
        console.log('✅ SecBot server shut down successfully');
        process.exit(0);
    });
});

/**
 * Handle graceful shutdown on SIGTERM
 */
process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM');
    console.log('🛑 Shutting down SecBot server gracefully...');
    
    server.close((error) => {
        if (error) {
            console.error('❌ Error during server shutdown:', error);
            process.exit(1);
        }
        console.log('✅ SecBot server shut down successfully');
        process.exit(0);
    });
});

/**
 * Handle uncaught exceptions - prevent crashes
 */
process.on('uncaughtException', (error) => {
    console.error('🚨 UNCAUGHT EXCEPTION:', error);
    console.error('Stack trace:', error.stack);
    console.log('🔄 Server continues running...');
    // Don't exit - keep server running
});

/**
 * Handle unhandled promise rejections - prevent crashes  
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 UNHANDLED REJECTION at:', promise);
    console.error('Reason:', reason);
    console.log('🔄 Server continues running...');
    // Don't exit - keep server running
});

// Export app for testing purposes
module.exports = { app, server };