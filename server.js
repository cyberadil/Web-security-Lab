// Web Security Lab - Main Server
// Created by Mohamed Adil

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const { initializeDatabase, insertDemoData } = require('./shared/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        security: 'Rate limiting prevents brute force attacks'
    }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve all demo frontend directories and root files
app.use(express.static(path.join(__dirname)));
app.use('/01-XSS-Demo Implementation', express.static(path.join(__dirname, '01-XSS-Demo Implementation')));
app.use('/02-SQL-Injection-Demo Implementation', express.static(path.join(__dirname, '02-SQL-Injection-Demo Implementation')));
app.use('/03-CSRF-Demo Implementation', express.static(path.join(__dirname, '03-CSRF-Demo Implementation')));
app.use('/04-E-commerce-Security Implementation', express.static(path.join(__dirname, '04-E-commerce-Security Implementation')));
app.use('/05-Security-Dashboard Implementation', express.static(path.join(__dirname, '05-Security-Dashboard Implementation')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '01-XSS-Demo Implementation/frontend/index.html'));
});

// Demo hub route
app.get('/demo-hub', (req, res) => {
    res.sendFile(path.join(__dirname, 'start-demo.html'));
});

// Connection test route
app.get('/test-connection', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-connection.html'));
});

// Theme verification route
app.get('/verify-theme', (req, res) => {
    res.sendFile(path.join(__dirname, 'verify-theme.html'));
});

// API Routes
app.use('/api/xss', require('./01-XSS-Demo Implementation/backend/routes/xss-routes'));
app.use('/api/sql', require('./02-SQL-Injection-Demo Implementation/auth-vulnerable'));
app.use('/api/sql-secure', require('./02-SQL-Injection-Demo Implementation/backend/routes/auth-secure'));
app.use('/api/csrf', require('./03-CSRF-Demo Implementation/middleware/csrf-protection').middleware());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        security: 'Health check endpoint for monitoring'
    });
});

// Security information endpoint
app.get('/api/security-info', (req, res) => {
    res.json({
        security_headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        },
        features: [
            'XSS Protection Demo',
            'SQL Injection Demo',
            'CSRF Protection Demo',
            'E-commerce Security',
            'Security Dashboard'
        ],
        author: 'Mohamed Adil',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        security: 'Generic error message prevents information disclosure'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        security: '404 responses don\'t reveal system information'
    });
});

// Initialize server
const startServer = async () => {
    try {
        // Try to initialize database (optional)
        try {
            await initializeDatabase();
            await insertDemoData();
            console.log('✅ Database initialized successfully');
        } catch (dbError) {
            console.log('⚠️  Database not available - running in demo mode');
            console.log('   SQL injection demos will use mock data');
        }
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Web Security Lab Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔒 Security info: http://localhost:${PORT}/api/security-info`);
            console.log(`🎯 XSS Demo: http://localhost:${PORT}/`);
            console.log(`👨‍💻 Author: Mohamed Adil`);
        });
        
    } catch (error) {
        console.error('❌ Server initialization failed:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer(); 