// Security Utilities for XSS Demo
// Created by Mohamed Adil

class SecurityUtils {
    constructor() {
        this.sanitizePatterns = {
            script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            iframe: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            object: /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
            embed: /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
            onEvent: /on\w+\s*=/gi,
            javascript: /javascript:/gi
        };
    }

    // HTML Entity Encoding
    encodeHtmlEntities(str) {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'/]/g, char => entities[char]);
    }

    // Basic XSS Sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        let sanitized = input;
        
        // Remove dangerous tags and attributes
        Object.values(this.sanitizePatterns).forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });
        
        // Encode HTML entities
        sanitized = this.encodeHtmlEntities(sanitized);
        
        return sanitized;
    }

    // Validate input for XSS patterns
    detectXSS(input) {
        const xssPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /vbscript:/i,
            /data:text\/html/i
        ];
        
        return xssPatterns.some(pattern => pattern.test(input));
    }

    // Create alert with cyberpunk styling
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        // Style based on type
        switch(type) {
            case 'danger':
                alertDiv.style.background = 'linear-gradient(45deg, #ff0040, #ff0066)';
                alertDiv.style.color = '#ffffff';
                alertDiv.style.border = '1px solid #ff0040';
                alertDiv.style.boxShadow = '0 0 20px rgba(255, 0, 64, 0.3)';
                break;
            case 'warning':
                alertDiv.style.background = 'linear-gradient(45deg, #ffaa00, #ffcc00)';
                alertDiv.style.color = '#000000';
                alertDiv.style.border = '1px solid #ffaa00';
                alertDiv.style.boxShadow = '0 0 20px rgba(255, 170, 0, 0.3)';
                break;
            case 'success':
                alertDiv.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
                alertDiv.style.color = '#000000';
                alertDiv.style.border = '1px solid #00ff88';
                alertDiv.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
                break;
            default:
                alertDiv.style.background = 'linear-gradient(45deg, #0080ff, #0066cc)';
                alertDiv.style.color = '#ffffff';
                alertDiv.style.border = '1px solid #0080ff';
                alertDiv.style.boxShadow = '0 0 20px rgba(0, 128, 255, 0.3)';
        }
        
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 5000);
    }

    // Add loading state to elements
    setLoading(element, isLoading = true) {
        if (isLoading) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    // Animate output box
    animateOutput(outputBox, content) {
        outputBox.style.opacity = '0';
        outputBox.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            outputBox.innerHTML = content;
            outputBox.style.transition = 'all 0.3s ease';
            outputBox.style.opacity = '1';
            outputBox.style.transform = 'translateY(0)';
        }, 150);
    }

    // Generate random XSS payloads for demo
    getRandomXSSPayload() {
        const payloads = [
            '<script>alert("XSS Attack!")</script>',
            '<img src="x" onerror="alert(\'XSS\')">',
            '<iframe src="javascript:alert(\'XSS\')"></iframe>',
            '<svg onload="alert(\'XSS\')">',
            'javascript:alert("XSS")',
            '<script>document.location="http://evil.com"</script>',
            '<img src="x" onmouseover="alert(\'XSS\')">',
            '<body onload="alert(\'XSS\')">'
        ];
        
        return payloads[Math.floor(Math.random() * payloads.length)];
    }

    // Log security events
    logSecurityEvent(event, details) {
        const timestamp = new Date().toISOString();
        console.log(`[SECURITY] ${timestamp} - ${event}:`, details);
        
        // In a real application, this would be sent to a logging service
        if (window.securityLogger) {
            window.securityLogger.log({
                timestamp,
                event,
                details,
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other scripts
window.SecurityUtils = new SecurityUtils();

// Add error handling for missing elements
window.addEventListener('error', (e) => {
    console.error('Security Utils Error:', e.error);
}); 