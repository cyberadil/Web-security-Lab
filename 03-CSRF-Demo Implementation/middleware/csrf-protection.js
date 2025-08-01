const crypto = require('crypto');

class CSRFProtection {
    constructor() {
        this.tokens = new Map();
    }
    
    generateToken(sessionId) {
        const token = crypto.randomBytes(32).toString('hex');
        const timestamp = Date.now();
        
        this.tokens.set(sessionId, {
            token: token,
            timestamp: timestamp,
            expires: timestamp + (60 * 60 * 1000) // 1 hour
        });
        
        return token;
    }
    
    validateToken(sessionId, providedToken) {
        const tokenData = this.tokens.get(sessionId);
        
        if (!tokenData) {
            return { valid: false, reason: 'No token found for session' };
        }
        
        if (Date.now() > tokenData.expires) {
            this.tokens.delete(sessionId);
            return { valid: false, reason: 'Token expired' };
        }
        
        if (tokenData.token !== providedToken) {
            return { valid: false, reason: 'Token mismatch' };
        }
        
        return { valid: true, reason: 'Token valid' };
    }
    
    middleware() {
        return (req, res, next) => {
            const sessionId = req.sessionID || req.headers['x-session-id'];
            const providedToken = req.body.csrfToken || req.headers['x-csrf-token'];
            
            if (req.method === 'GET') {
                // Generate token for GET requests
                const token = this.generateToken(sessionId);
                res.locals.csrfToken = token;
                return next();
            }
            
            // Validate token for state-changing requests
            const validation = this.validateToken(sessionId, providedToken);
            
            if (!validation.valid) {
                return res.status(403).json({
                    success: false,
                    message: 'CSRF token validation failed',
                    reason: validation.reason,
                    security: 'CSRF protection prevented unauthorized request'
                });
            }
            
            next();
        };
    }
}

module.exports = new CSRFProtection();