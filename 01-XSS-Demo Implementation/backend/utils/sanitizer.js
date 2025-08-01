const validator = require('validator');

function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    // Remove HTML tags and encode special characters
    let sanitized = validator.escape(input);
    
    // Additional sanitization rules
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    
    return sanitized;
}

function isXSSAttempt(input) {
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
}

module.exports = {
    sanitizeInput,
    isXSSAttempt
};