// XSS Demo Implementation
// Created by Mohamed Adil

class XSSDemo {
    constructor() {
        this.utils = window.SecurityUtils;
        this.vulnerableInput = document.getElementById('vulnerable-input');
        this.secureInput = document.getElementById('secure-input');
        this.vulnerableOutput = document.getElementById('vulnerable-output');
        this.secureOutput = document.getElementById('secure-output');
        
        this.init();
    }

    init() {
        // Add event listeners
        this.addEventListeners();
        
        // Add demo payloads
        this.addDemoPayloads();
        
        // Initialize with welcome message
        this.showWelcomeMessage();
        
        // Log initialization
        this.utils.logSecurityEvent('XSS_DEMO_INITIALIZED', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }

    addEventListeners() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.runDemo();
            }
        });

        // Add input event listeners for real-time validation
        this.vulnerableInput.addEventListener('input', (e) => {
            this.validateInput(e.target.value, 'vulnerable');
        });

        this.secureInput.addEventListener('input', (e) => {
            this.validateInput(e.target.value, 'secure');
        });
    }

    addDemoPayloads() {
        // Add quick demo buttons
        const demoContainer = document.createElement('div');
        demoContainer.className = 'demo-payloads';
        demoContainer.style.cssText = `
            margin: 1rem 0;
            padding: 1rem;
            background: rgba(0, 128, 255, 0.1);
            border-radius: 8px;
            border: 1px solid #0080ff;
        `;
        
        demoContainer.innerHTML = `
            <h4 style="color: #0080ff; margin-bottom: 0.5rem; font-family: 'Orbitron', monospace;">
                🧪 Quick Demo Payloads:
            </h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button onclick="xssDemo.insertPayload('<script>alert(\'XSS!\')</script>')" 
                        style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                    Basic Script
                </button>
                <button onclick="xssDemo.insertPayload('<img src=\"x\" onerror=\"alert(\'XSS\')\">')" 
                        style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                    Image XSS
                </button>
                <button onclick="xssDemo.insertPayload('javascript:alert(\"XSS\")')" 
                        style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                    JavaScript URL
                </button>
                <button onclick="xssDemo.insertPayload('Hello <script>alert(\'XSS\')</script> World!')" 
                        style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                    Mixed Content
                </button>
            </div>
        `;
        
        // Insert after the first demo section
        const firstDemoSection = document.querySelector('.demo-section');
        firstDemoSection.appendChild(demoContainer);
    }

    insertPayload(payload) {
        this.vulnerableInput.value = payload;
        this.utils.showAlert(`Payload inserted: ${payload}`, 'info');
        this.validateInput(payload, 'vulnerable');
    }

    validateInput(input, type) {
        const hasXSS = this.utils.detectXSS(input);
        
        if (hasXSS) {
            this.utils.logSecurityEvent('XSS_DETECTED', {
                input: input,
                type: type,
                timestamp: new Date().toISOString()
            });
            
            if (type === 'secure') {
                this.utils.showAlert('⚠️ XSS pattern detected! Input will be sanitized.', 'warning');
            }
        }
    }

    showWelcomeMessage() {
        const welcomeMsg = `
            <div style="color: #00ff88; font-weight: 500; margin-bottom: 1rem;">
                🔍 Welcome to the XSS Vulnerability Demo!
            </div>
            <div style="color: #cccccc; font-size: 0.9rem; line-height: 1.5;">
                <p>This demo showcases the difference between vulnerable and secure implementations of user input handling.</p>
                <p><strong>Try entering:</strong></p>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li>Regular text to see normal behavior</li>
                    <li>HTML tags like &lt;b&gt;Hello&lt;/b&gt;</li>
                    <li>Script tags like &lt;script&gt;alert('XSS')&lt;/script&gt;</li>
                    <li>Or use the quick demo buttons above!</li>
                </ul>
            </div>
        `;
        
        this.utils.animateOutput(this.vulnerableOutput, welcomeMsg);
        this.utils.animateOutput(this.secureOutput, welcomeMsg);
    }

    vulnerableSubmit() {
        const input = this.vulnerableInput.value;
        const outputBox = this.vulnerableOutput;
        
        if (!input.trim()) {
            this.utils.showAlert('Please enter some text to test!', 'warning');
            return;
        }

        // Simulate processing
        this.utils.setLoading(document.querySelector('button[onclick="vulnerableSubmit()"]'), true);
        
        setTimeout(() => {
            // VULNERABLE: Directly insert user input without sanitization
            const vulnerableOutput = `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #ff0040;">⚠️ VULNERABLE OUTPUT:</strong>
                </div>
                <div style="background: rgba(255, 0, 64, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #ff0040;">
                    ${input}
                </div>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #ffaa00;">
                    <strong>Risk:</strong> This implementation directly renders user input, making it vulnerable to XSS attacks.
                </div>
            `;
            
            this.utils.animateOutput(outputBox, vulnerableOutput);
            this.utils.setLoading(document.querySelector('button[onclick="vulnerableSubmit()"]'), false);
            
            // Log the vulnerability
            this.utils.logSecurityEvent('VULNERABLE_INPUT_PROCESSED', {
                input: input,
                hasXSS: this.utils.detectXSS(input)
            });
            
            if (this.utils.detectXSS(input)) {
                this.utils.showAlert('🚨 XSS Attack Detected! This input could execute malicious code!', 'danger');
                outputBox.classList.add('alert-danger');
            }
        }, 1000);
    }

    secureSubmit() {
        const input = this.secureInput.value;
        const outputBox = this.secureOutput;
        
        if (!input.trim()) {
            this.utils.showAlert('Please enter some text to test!', 'warning');
            return;
        }

        // Simulate processing
        this.utils.setLoading(document.querySelector('button[onclick="secureSubmit()"]'), true);
        
        setTimeout(() => {
            // SECURE: Sanitize input before rendering
            const sanitizedInput = this.utils.sanitizeInput(input);
            const hadXSS = this.utils.detectXSS(input);
            
            const secureOutput = `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #00ff88;">🛡️ SECURE OUTPUT:</strong>
                </div>
                <div style="background: rgba(0, 255, 136, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #00ff88;">
                    ${sanitizedInput}
                </div>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #00ff88;">
                    <strong>Protection:</strong> Input was sanitized using HTML entity encoding and pattern filtering.
                </div>
                ${hadXSS ? `
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #ffaa00;">
                    <strong>XSS Blocked:</strong> Malicious content was detected and neutralized.
                </div>
                ` : ''}
            `;
            
            this.utils.animateOutput(outputBox, secureOutput);
            this.utils.setLoading(document.querySelector('button[onclick="secureSubmit()"]'), false);
            
            // Log the secure processing
            this.utils.logSecurityEvent('SECURE_INPUT_PROCESSED', {
                originalInput: input,
                sanitizedInput: sanitizedInput,
                hadXSS: hadXSS
            });
            
            if (hadXSS) {
                this.utils.showAlert('✅ XSS Attack Blocked! Input was safely sanitized.', 'success');
                outputBox.classList.add('status-secure');
            } else {
                this.utils.showAlert('✅ Input processed securely!', 'success');
            }
        }, 1000);
    }

    runDemo() {
        // Run a complete demo with a sample payload
        const demoPayload = this.utils.getRandomXSSPayload();
        
        this.vulnerableInput.value = demoPayload;
        this.secureInput.value = demoPayload;
        
        this.utils.showAlert('🧪 Running demo with random XSS payload...', 'info');
        
        setTimeout(() => {
            this.vulnerableSubmit();
        }, 500);
        
        setTimeout(() => {
            this.secureSubmit();
        }, 1500);
    }

    // Add keyboard shortcuts info
    showKeyboardShortcuts() {
        const shortcuts = `
            <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0, 0, 0, 0.8); 
                        padding: 1rem; border-radius: 8px; border: 1px solid #0080ff; font-size: 0.8rem;">
                <strong style="color: #0080ff;">⌨️ Shortcuts:</strong><br>
                Ctrl+Enter: Run Demo<br>
                Esc: Clear inputs
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', shortcuts);
    }
}

// Initialize the demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.xssDemo = new XSSDemo();
        
        // Add keyboard shortcuts info
        setTimeout(() => {
            if (window.xssDemo) {
                window.xssDemo.showKeyboardShortcuts();
            }
        }, 2000);
        
        // Add escape key to clear inputs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const vulnerableInput = document.getElementById('vulnerable-input');
                const secureInput = document.getElementById('secure-input');
                if (vulnerableInput) vulnerableInput.value = '';
                if (secureInput) secureInput.value = '';
                if (window.xssDemo) {
                    window.xssDemo.showWelcomeMessage();
                }
            }
        });
    } catch (error) {
        console.error('XSS Demo initialization error:', error);
        // Fallback: show basic functionality
        const fallbackMsg = `
            <div style="color: #ff0040; padding: 1rem; background: rgba(255, 0, 64, 0.1); border-radius: 8px;">
                <strong>Error:</strong> Demo failed to initialize. Please refresh the page.
            </div>
        `;
        const outputs = document.querySelectorAll('.output-box');
        outputs.forEach(output => {
            if (output) output.innerHTML = fallbackMsg;
        });
    }
});

// Global functions for onclick handlers
function vulnerableSubmit() {
    if (window.xssDemo) {
        window.xssDemo.vulnerableSubmit();
    }
}

function secureSubmit() {
    if (window.xssDemo) {
        window.xssDemo.secureSubmit();
    }
} 