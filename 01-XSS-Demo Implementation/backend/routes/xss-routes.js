// XSS Demo Routes
// Created by Mohamed Adil

const express = require('express');
const router = express.Router();

// VULNERABLE XSS endpoint (for educational purposes)
router.post('/vulnerable', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({
            success: false,
            message: 'Message is required',
            vulnerability: 'Missing input validation'
        });
    }
    
    // DANGEROUS: Directly return user input without sanitization
    const response = {
        success: true,
        message: 'Message processed',
        output: message, // VULNERABLE: Direct output
        vulnerability: 'This endpoint is vulnerable to XSS attacks',
        warning: 'This is for educational purposes only'
    };
    
    res.json(response);
});

// SECURE XSS endpoint
router.post('/secure', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({
            success: false,
            message: 'Message is required',
            security: 'Input validation prevents empty submissions'
        });
    }
    
    // SECURE: Sanitize input
    const sanitizedMessage = sanitizeInputLocal(message);
    
    const response = {
        success: true,
        message: 'Message processed securely',
        originalInput: message,
        sanitizedOutput: sanitizedMessage,
        security: 'Input was sanitized using HTML entity encoding',
        hadXSS: detectXSS(message)
    };
    
    res.json(response);
});

// XSS detection endpoint
router.post('/detect', (req, res) => {
    const { input } = req.body;
    
    if (!input) {
        return res.status(400).json({
            success: false,
            message: 'Input is required'
        });
    }
    
    const hasXSS = detectXSS(input);
    const patterns = getXSSPatterns(input);
    
    res.json({
        success: true,
        hasXSS: hasXSS,
        patterns: patterns,
        input: input,
        security: hasXSS ? 'XSS pattern detected' : 'No XSS patterns found'
    });
});

// Sanitization endpoint
router.post('/sanitize', (req, res) => {
    const { input } = req.body;
    
    if (!input) {
        return res.status(400).json({
            success: false,
            message: 'Input is required'
        });
    }
    
    const sanitized = sanitizeInputLocal(input);
    const hadXSS = detectXSS(input);
    
    res.json({
        success: true,
        originalInput: input,
        sanitizedOutput: sanitized,
        hadXSS: hadXSS,
        security: 'Input sanitized using multiple techniques'
    });
});

// Helper functions
function sanitizeInputLocal(input) {
    if (typeof input !== 'string') return '';
    
    // Remove dangerous tags and attributes
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
        /on\w+\s*=/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /data:text\/html/gi
    ];
    
    let sanitized = input;
    
    // Remove dangerous patterns
    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });
    
    // HTML entity encoding
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    
    sanitized = sanitized.replace(/[&<>"'/]/g, char => entities[char]);
    
    return sanitized;
}

function detectXSS(input) {
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /vbscript:/i,
        /data:text\/html/i,
        /<svg/i,
        /<img.*on/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
}

function getXSSPatterns(input) {
    const patterns = [
        { name: 'Script Tag', pattern: /<script/i, found: /<script/i.test(input) },
        { name: 'JavaScript URL', pattern: /javascript:/i, found: /javascript:/i.test(input) },
        { name: 'Event Handler', pattern: /on\w+\s*=/i, found: /on\w+\s*=/i.test(input) },
        { name: 'Iframe', pattern: /<iframe/i, found: /<iframe/i.test(input) },
        { name: 'Object Tag', pattern: /<object/i, found: /<object/i.test(input) },
        { name: 'Embed Tag', pattern: /<embed/i, found: /<embed/i.test(input) },
        { name: 'VBScript', pattern: /vbscript:/i, found: /vbscript:/i.test(input) },
        { name: 'Data URL', pattern: /data:text\/html/i, found: /data:text\/html/i.test(input) },
        { name: 'SVG', pattern: /<svg/i, found: /<svg/i.test(input) },
        { name: 'Image with Event', pattern: /<img.*on/i, found: /<img.*on/i.test(input) }
    ];
    
    return patterns.filter(p => p.found);
}

module.exports = router;