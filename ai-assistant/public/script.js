class SecBotAssistant {
    constructor() {
        this.apiUrl = 'http://localhost:3001/api';
        this.sessionId = this.generateSessionId();
        this.isLoading = false;
        this.conversationHistory = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTheme();
        this.loadChatHistory();
        
        console.log('🤖 SecBot Assistant initialized');
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    initializeElements() {
        // Main chat elements
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearChatButton = document.getElementById('clearChat');
        this.characterCount = document.querySelector('.character-count');
        
        // Widget elements
        this.chatWidget = document.getElementById('chatWidget');
        this.openWidgetButton = document.getElementById('openWidget');
        this.closeWidgetButton = document.getElementById('closeWidget');
        this.minimizeWidgetButton = document.getElementById('minimizeWidget');
        this.widgetMessages = document.getElementById('widgetMessages');
        this.widgetInput = document.getElementById('widgetInput');
        this.widgetSendButton = document.getElementById('widgetSend');
        
        // Quick question buttons
        this.quickQuestionButtons = document.querySelectorAll('.quick-question');
    }
    
    attachEventListeners() {
        // Main chat listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.chatInput.addEventListener('input', () => this.handleInputChange());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.clearChatButton.addEventListener('click', () => this.clearChat());
        
        // Widget listeners
        this.openWidgetButton.addEventListener('click', () => this.openWidget());
        this.closeWidgetButton.addEventListener('click', () => this.closeWidget());
        this.minimizeWidgetButton.addEventListener('click', () => this.minimizeWidget());
        this.widgetSendButton.addEventListener('click', () => this.sendWidgetMessage());
        this.widgetInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendWidgetMessage();
            }
        });
        
        // Quick question listeners
        this.quickQuestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.getAttribute('data-question');
                this.chatInput.value = question;
                this.handleInputChange();
                this.sendMessage();
            });
        });
        
        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
        });
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }
    
    handleInputChange() {
        const text = this.chatInput.value;
        const length = text.length;
        const maxLength = 1000;
        
        this.characterCount.textContent = `${length}/${maxLength}`;
        this.sendButton.disabled = length === 0 || length > maxLength || this.isLoading;
        
        if (length > maxLength) {
            this.characterCount.style.color = 'var(--danger-neon)';
        } else {
            this.characterCount.style.color = 'var(--text-secondary)';
        }
    }
    
    async sendMessage(isWidget = false) {
        const input = isWidget ? this.widgetInput : this.chatInput;
        const message = input.value.trim();
        
        if (!message || this.isLoading) return;
        
        // Add user message to UI
        this.addMessage(message, 'user', isWidget);
        
        // Clear input
        input.value = '';
        this.handleInputChange();
        
        // Show loading
        this.setLoading(true);
        
        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response');
            }
            
            const data = await response.json();
            
            // Add bot response to UI
            this.addMessage(data.response, 'bot', isWidget);
            
            // Save to conversation history
            this.conversationHistory.push(
                { role: 'user', content: message, timestamp: new Date().toISOString() },
                { role: 'assistant', content: data.response, timestamp: data.timestamp }
            );
            
            this.saveChatHistory();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage(
                `Sorry, I encountered an error: ${error.message}. Please try again.`,
                'bot',
                isWidget,
                true
            );
        } finally {
            this.setLoading(false);
        }
    }
    
    addMessage(content, sender, isWidget = false, isError = false) {
        const messagesContainer = isWidget ? this.widgetMessages : this.chatMessages;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message${isError ? ' error-message' : ''}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Process message content (handle markdown-like formatting)
        textDiv.innerHTML = this.formatMessage(content);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();
        
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // If this is a widget message, also add to main chat if widget is minimized
        if (isWidget && !this.chatWidget.classList.contains('minimized')) {
            // Don't duplicate in main chat
        }
    }
    
    formatMessage(content) {
        // Basic markdown-like formatting
        let formatted = content
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Line breaks
            .replace(/\n/g, '<br>');
        
        // Convert lists
        formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        return formatted;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading || this.chatInput.value.trim().length === 0;
        this.widgetSendButton.disabled = loading;
        
        if (loading) {
            this.loadingIndicator.classList.add('show');
        } else {
            this.loadingIndicator.classList.remove('show');
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('secbot-theme', newTheme);
        
        // Update theme toggle icon
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('secbot-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    }
    
    async clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            // Clear UI
            const messages = this.chatMessages.querySelectorAll('.message:not(.welcome-message)');
            messages.forEach(message => message.remove());
            
            // Clear widget messages
            const widgetMessages = this.widgetMessages.querySelectorAll('.message:not(:first-child)');
            widgetMessages.forEach(message => message.remove());
            
            // Clear conversation history
            this.conversationHistory = [];
            localStorage.removeItem('secbot-chat-history');
            
            // Clear server session
            try {
                await fetch(`${this.apiUrl}/chat/${this.sessionId}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Error clearing server session:', error);
            }
            
            // Generate new session ID
            this.sessionId = this.generateSessionId();
        }
    }
    
    saveChatHistory() {
        try {
            localStorage.setItem('secbot-chat-history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }
    
    loadChatHistory() {
        try {
            const saved = localStorage.getItem('secbot-chat-history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                
                // Restore messages to UI (skip welcome message recreation)
                this.conversationHistory.forEach(msg => {
                    if (msg.role === 'user') {
                        this.addMessage(msg.content, 'user');
                    } else {
                        this.addMessage(msg.content, 'bot');
                    }
                });
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
    
    // Widget methods
    openWidget() {
        this.chatWidget.classList.remove('hidden');
        this.openWidgetButton.classList.add('hidden');
    }
    
    closeWidget() {
        this.chatWidget.classList.add('hidden');
        this.openWidgetButton.classList.remove('hidden');
    }
    
    minimizeWidget() {
        this.chatWidget.classList.toggle('minimized');
        const minimizeIcon = this.minimizeWidgetButton;
        minimizeIcon.textContent = this.chatWidget.classList.contains('minimized') ? '+' : '−';
    }
    
    sendWidgetMessage() {
        this.sendMessage(true);
    }
    
    // Public API for integration
    static create(options = {}) {
        return new SecBotAssistant(options);
    }
    
    // Method to integrate widget into existing pages
    static integrateWidget(targetElement, options = {}) {
        const widget = document.createElement('div');
        widget.innerHTML = `
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
                                <div class="message-text">Hi! I'm SecBot. Ask me about web security!</div>
                            </div>
                        </div>
                    </div>
                    <div class="widget-input">
                        <input type="text" id="widgetInput" placeholder="Ask about security...">
                        <button id="widgetSend">📤</button>
                    </div>
                </div>
            </div>
            <button id="openWidget" class="open-widget-button">
                <span class="widget-icon">🤖</span>
                <span class="widget-text">Ask SecBot</span>
            </button>
        `;
        
        if (targetElement) {
            targetElement.appendChild(widget);
        } else {
            document.body.appendChild(widget);
        }
        
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="secbot"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = options.cssPath || '/ai-assistant/styles.css';
            document.head.appendChild(link);
        }
        
        return new SecBotAssistant(options);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.secBot = new SecBotAssistant();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecBotAssistant;
}