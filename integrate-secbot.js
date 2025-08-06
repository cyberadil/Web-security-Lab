/**
 * SecBot Integration Script for Web Security Lab
 * 
 * This script adds the SecBot AI assistant widget to any page
 * Simply include this script and call integrateSecBot()
 */

class SecBotIntegration {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || 'http://localhost:3001/api';

        // Derive base URL from the apiUrl to make it more robust for deployment
        const baseUrl = this.apiUrl.replace('/api', '');
        this.cssUrl = options.cssUrl || `${baseUrl}/styles.css`;
        this.jsUrl = options.jsUrl || `${baseUrl}/script.js`;

        this.position = options.position || 'bottom-right';
        this.theme = options.theme || 'dark';
        
        this.isLoaded = false;
        this.isServerAvailable = false;
    }
    
    async checkServerStatus() {
        try {
            const response = await fetch(`${this.apiUrl.replace('/api', '')}/health`);
            this.isServerAvailable = response.ok;
            return this.isServerAvailable;
        } catch (error) {
            console.warn('SecBot server not available:', error.message);
            this.isServerAvailable = false;
            return false;
        }
    }
    
    async loadCSS() {
        return new Promise((resolve, reject) => {
            // Check if CSS is already loaded
            if (document.querySelector(`link[href="${this.cssUrl}"]`)) {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.cssUrl;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    async loadJS() {
        return new Promise((resolve, reject) => {
            // Check if JS is already loaded
            if (window.SecBotAssistant) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = this.jsUrl;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    createWidget() {
        // Remove existing widget if present
        const existingWidget = document.getElementById('secbot-widget-container');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'secbot-widget-container';
        widgetContainer.innerHTML = `
            <div id="chatWidget" class="chat-widget hidden">
                <div class="widget-header">
                    <div class="widget-title">
                        <span class="widget-icon">🤖</span>
                        <span>SecBot</span>
                    </div>
                    <div class="widget-controls">
                        <button id="minimizeWidget" class="widget-control">−</button>
                        <button id="closeWidget" class="widget-control">×</button>
                    </div>
                </div>
                <div class="widget-content">
                    <div id="widgetMessages" class="widget-messages">
                        <div class="message bot-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <div class="message-text">
                                    Hi! I'm <strong>SecBot</strong> – your Web Security Assistant. 
                                    Ask me about vulnerabilities, exploits, or security best practices!
                                </div>
                                <div class="message-time">${new Date().toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>
                    <div class="widget-input">
                        <input type="text" id="widgetInput" placeholder="Ask about web security..." maxlength="1000">
                        <button id="widgetSend" title="Send message">📤</button>
                    </div>
                </div>
            </div>
            <button id="openWidget" class="open-widget-button" title="Open SecBot Assistant">
                <span class="widget-icon">🤖</span>
                <span class="widget-text">Ask SecBot</span>
            </button>
        `;
        
        document.body.appendChild(widgetContainer);
        return widgetContainer;
    }
    
    showOfflineMessage() {
        const offlineButton = document.createElement('div');
        offlineButton.id = 'secbot-offline';
        offlineButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff0040;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Roboto Mono', monospace;
            font-size: 0.9rem;
            z-index: 1000;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #ff0040;
        `;
        offlineButton.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>🤖</span>
                <span>SecBot Offline</span>
            </div>
            <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.25rem;">
                Start server: npm start
            </div>
        `;
        
        offlineButton.addEventListener('click', () => {
            alert('SecBot server is not running.\n\nTo start SecBot:\n1. Navigate to the ai-assistant folder\n2. Run: npm start\n3. Refresh this page');
        });
        
        document.body.appendChild(offlineButton);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (offlineButton.parentNode) {
                offlineButton.style.opacity = '0.5';
                offlineButton.style.transform = 'scale(0.8)';
            }
        }, 10000);
    }
    
    async integrate() {
        try {
            console.log('🤖 Integrating SecBot...');
            
            // Check if server is available
            const serverAvailable = await this.checkServerStatus();
            
            if (!serverAvailable) {
                console.warn('⚠️ SecBot server not available');
                this.showOfflineMessage();
                return false;
            }
            
            // Load CSS and JS
            await Promise.all([
                this.loadCSS(),
                this.loadJS()
            ]);
            
            // Wait a bit for JS to initialize
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Create widget HTML
            this.createWidget();
            
            // Initialize SecBot functionality
            if (window.SecBotAssistant) {
                // Custom initialization for widget
                const secBot = new window.SecBotAssistant();
                console.log('✅ SecBot integrated successfully');
                this.isLoaded = true;
                return true;
            } else {
                throw new Error('SecBotAssistant not loaded');
            }
            
        } catch (error) {
            console.error('❌ Failed to integrate SecBot:', error);
            this.showOfflineMessage();
            return false;
        }
    }
    
    // Public method to check if SecBot is ready
    isReady() {
        return this.isLoaded && this.isServerAvailable;
    }
    
    // Public method to send a message programmatically
    async sendMessage(message) {
        if (!this.isReady()) {
            console.warn('SecBot is not ready');
            return null;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: 'integration-' + Date.now()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to get response');
            }
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error sending message to SecBot:', error);
            return null;
        }
    }
}

// Global integration function
window.integrateSecBot = async function(options = {}) {
    const integration = new SecBotIntegration(options);
    const success = await integration.integrate();
    
    if (success) {
        // Store integration instance globally
        window.secBotIntegration = integration;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('secbot-ready', {
            detail: { integration }
        }));
    }
    
    return integration;
};

// Auto-integrate if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Auto-integrate with default options if not already done
        if (!window.secBotIntegration) {
            window.integrateSecBot();
        }
    });
} else {
    // DOM is already loaded
    if (!window.secBotIntegration) {
        window.integrateSecBot();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecBotIntegration;
}