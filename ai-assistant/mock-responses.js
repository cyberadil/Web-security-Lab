/**
 * Mock AI Responses for SecBot - Demo Mode
 * Use when OpenAI API is unavailable or quota exceeded
 */

const mockResponses = {
    // XSS Related Questions
    xss: [
        {
            keywords: ['xss', 'cross-site scripting', 'script injection'],
            response: "🛡️ **Cross-Site Scripting (XSS) Prevention:**\n\n**What is XSS?**\nXSS occurs when malicious scripts are injected into trusted websites.\n\n**Prevention Methods:**\n• **Input Sanitization**: Remove/escape dangerous characters\n• **Output Encoding**: Encode data before displaying\n• **Content Security Policy (CSP)**: Restrict script execution\n• **Validate Input**: Check all user inputs\n• **Use Safe APIs**: Use textContent instead of innerHTML\n\n**Example Safe Code:**\n```javascript\n// ❌ Dangerous\nelement.innerHTML = userInput;\n\n// ✅ Safe\nelement.textContent = userInput;\n```\n\n**Try the XSS demo to see these concepts in action!**"
        }
    ],

    // SQL Injection Related
    sql: [
        {
            keywords: ['sql injection', 'sql', 'database', 'sqli'],
            response: "🔒 **SQL Injection Prevention:**\n\n**What is SQL Injection?**\nAttackers inject malicious SQL code to manipulate database queries.\n\n**Prevention Strategies:**\n• **Parameterized Queries**: Use prepared statements\n• **Input Validation**: Sanitize all user inputs\n• **Least Privilege**: Limit database user permissions\n• **Stored Procedures**: Use when appropriate\n• **Escape Special Characters**: Prevent SQL metacharacters\n\n**Example Safe Query:**\n```sql\n-- ❌ Vulnerable\nSELECT * FROM users WHERE username = 'userInput';\n\n-- ✅ Safe (Parameterized)\nSELECT * FROM users WHERE username = ?;\n```\n\n**Common Attack Patterns:**\n• `admin' OR '1'='1' --`\n• `'; DROP TABLE users; --`\n\n**Test the SQL Injection demo to understand these attacks!**"
        }
    ],

    // CSRF Related
    csrf: [
        {
            keywords: ['csrf', 'cross-site request forgery', 'token'],
            response: "🔄 **CSRF Protection Guide:**\n\n**What is CSRF?**\nAttackers trick users into making unwanted requests to websites where they're authenticated.\n\n**Protection Methods:**\n• **CSRF Tokens**: Unique tokens per session/form\n• **SameSite Cookies**: Restrict cross-site cookie sending\n• **Referer Header Check**: Validate request origin\n• **Custom Headers**: Require custom headers for sensitive operations\n\n**Implementation Example:**\n```html\n<!-- Add CSRF token to forms -->\n<input type=\"hidden\" name=\"csrf_token\" value=\"{{csrf_token}}\">\n```\n\n**Cookie Security:**\n```javascript\n// Set SameSite cookie\nres.cookie('sessionId', value, {\n    sameSite: 'strict',\n    secure: true,\n    httpOnly: true\n});\n```\n\n**Try the CSRF demo to see protection in action!**"
        }
    ],

    // E-commerce Security
    ecommerce: [
        {
            keywords: ['ecommerce', 'payment', 'pci', 'checkout', 'security'],
            response: "🛒 **E-commerce Security Best Practices:**\n\n**Payment Security:**\n• **PCI DSS Compliance**: Follow payment card industry standards\n• **HTTPS/TLS**: Encrypt all data transmission\n• **Tokenization**: Replace sensitive data with tokens\n• **Input Validation**: Validate all form inputs\n\n**Key Security Measures:**\n• **Secure Sessions**: Implement proper session management\n• **Rate Limiting**: Prevent automated attacks\n• **Fraud Detection**: Monitor suspicious activities\n• **Data Encryption**: Encrypt sensitive data at rest\n\n**PCI DSS Requirements:**\n1. Build and maintain secure networks\n2. Protect stored cardholder data\n3. Maintain vulnerability management\n4. Implement strong access controls\n5. Regularly monitor networks\n6. Maintain information security policy\n\n**Test the E-commerce Security demo for hands-on experience!**"
        }
    ],

    // General Security
    general: [
        {
            keywords: ['security', 'vulnerability', 'attack', 'defense', 'protection'],
            response: "🔐 **Web Security Fundamentals:**\n\n**Common Vulnerabilities (OWASP Top 10):**\n• **Injection Attacks** (SQL, XSS, Command)\n• **Broken Authentication** & Session Management\n• **Sensitive Data Exposure**\n• **XML External Entities (XXE)**\n• **Broken Access Control**\n• **Security Misconfiguration**\n• **Cross-Site Scripting (XSS)**\n• **Insecure Deserialization**\n• **Using Components with Known Vulnerabilities**\n• **Insufficient Logging & Monitoring**\n\n**Defense Strategies:**\n• **Defense in Depth**: Multiple security layers\n• **Input Validation**: Validate all user inputs\n• **Authentication & Authorization**: Control access\n• **Encryption**: Protect data in transit and at rest\n• **Regular Updates**: Keep software current\n• **Security Headers**: Use protective HTTP headers\n\n**Explore our lab demos to learn hands-on security testing!**"
        }
    ],

    // Default fallback responses
    fallback: [
        "🤖 **SecBot Demo Mode** - I'm running in offline mode due to API limitations.\n\n**I can help you with:**\n• XSS (Cross-Site Scripting) prevention\n• SQL Injection protection\n• CSRF attack mitigation\n• E-commerce security\n• General web security concepts\n\n**Try asking about specific security topics or explore our interactive demos!**",
        
        "🛡️ **Security Learning Assistant** - Currently in demo mode.\n\n**Available Topics:**\n• Web vulnerability analysis\n• Secure coding practices\n• Attack pattern recognition\n• Defense implementation\n• Security testing methodologies\n\n**Ask me about any security concept or try our hands-on demos!**",
        
        "🔒 **Web Security Expert** - Demo responses active.\n\n**I specialize in:**\n• Identifying security vulnerabilities\n• Implementing protection measures\n• Teaching secure development\n• Explaining attack vectors\n• Security best practices\n\n**What security topic would you like to explore?**"
    ]
};

/**
 * Get a mock response based on user message
 * @param {string} message - User's input message
 * @returns {string} - Appropriate mock response
 */
function getMockResponse(message) {
    const lowercaseMessage = message.toLowerCase();
    
    // Check each category for keyword matches
    for (const [category, responses] of Object.entries(mockResponses)) {
        if (category === 'fallback') continue;
        
        for (const responseObj of responses) {
            if (responseObj.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
                return responseObj.response;
            }
        }
    }
    
    // Return random fallback response
    const fallbackResponses = mockResponses.fallback;
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/**
 * Get a contextual response for specific demos
 * @param {string} demo - Demo type (xss, sql, csrf, ecommerce)
 * @returns {string} - Demo-specific guidance
 */
function getDemoGuidance(demo) {
    const guidance = {
        xss: "🔍 **XSS Demo Tips:**\n\nTry these test payloads:\n• `<script>alert('XSS')</script>`\n• `<img src=x onerror=alert('XSS')>`\n• `javascript:alert('XSS')`\n\nCompare the vulnerable vs secure implementations to see how proper sanitization works!",
        
        sql: "💉 **SQL Injection Demo Tips:**\n\nTry these payloads:\n• Username: `admin' OR '1'='1' --`\n• Username: `'; DROP TABLE users; --`\n• Username: `admin' UNION SELECT username, password FROM users --`\n\nSee how parameterized queries prevent these attacks!",
        
        csrf: "🔄 **CSRF Demo Tips:**\n\nNotice how:\n• Protected forms include CSRF tokens\n• Vulnerable forms lack protection\n• Tokens are validated server-side\n• Failed validation blocks requests\n\nThis prevents unauthorized actions on behalf of users!",
        
        ecommerce: "🛒 **E-commerce Demo Tips:**\n\nCompare:\n• Secure checkout with encryption\n• Vulnerable form without protection\n• PCI DSS compliance features\n• Input validation differences\n\nSee how proper security protects payment data!"
    };
    
    return guidance[demo] || guidance.xss;
}

module.exports = {
    getMockResponse,
    getDemoGuidance,
    mockResponses
};