/**
 * SecBot AI Assistant Widget
 * Provides a floating chat interface for the AI security assistant
 * Created by Mohamed Adil
 */

class SecBotWidget {
  constructor(options = {}) {
    this.options = {
      apiUrl: options.apiUrl || 'http://localhost:3001/api/chat',
      botName: options.botName || 'SecBot',
      botAvatar: options.botAvatar || '/shared/images/secbot-icon.svg',
      welcomeMessage: options.welcomeMessage || 'Hello! I\'m SecBot, your AI security assistant. Ask me anything about web security vulnerabilities like XSS, SQL Injection, CSRF, and more!',
      placeholder: options.placeholder || 'Ask a security question...',
      sessionId: options.sessionId || this.generateSessionId(),
      ...options
    };

    this.messages = [];
    this.isLoading = false;
    this.isOpen = false;
    this.initialized = false;
    this.storageKey = 'secbot_chat_history';

    // Initialize the widget
    this.init();
  }

  /**
   * Initialize the widget
   */
  init() {
    // Create widget elements
    this.createWidgetElements();
    
    // Add event listeners
    this.addEventListeners();
    
    // Load chat history from localStorage
    this.loadChatHistory();
    
    // Add welcome message if no history
    if (this.messages.length === 0) {
      this.addBotMessage(this.options.welcomeMessage);
    }
    
    this.initialized = true;
    
    // Log initialization
    console.log(`[SecBot] Widget initialized with session ID: ${this.options.sessionId}`);
  }

  /**
   * Create widget DOM elements
   */
  createWidgetElements() {
    // Create main container
    this.widget = document.createElement('div');
    this.widget.className = 'secbot-widget';
    
    // Create chat button
    this.button = document.createElement('button');
    this.button.className = 'secbot-button';
    this.button.innerHTML = `
      <img src="${this.options.botAvatar}" alt="SecBot">
      <span class="secbot-tooltip">Chat with SecBot</span>
    `;
    
    // Create chat window
    this.chat = document.createElement('div');
    this.chat.className = 'secbot-chat';
    
    // Create chat header
    this.header = document.createElement('div');
    this.header.className = 'secbot-header';
    this.header.innerHTML = `
      <div class="secbot-header-title">
        <img src="${this.options.botAvatar}" alt="SecBot">
        <h3>${this.options.botName}</h3>
      </div>
      <button class="secbot-close">&times;</button>
    `;
    
    // Create messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'secbot-messages';
    
    // Create input area
    this.inputArea = document.createElement('div');
    this.inputArea.className = 'secbot-input';
    this.inputArea.innerHTML = `
      <input type="text" placeholder="${this.options.placeholder}">
      <button type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
        </svg>
      </button>
    `;
    
    // Assemble the widget
    this.chat.appendChild(this.header);
    this.chat.appendChild(this.messagesContainer);
    this.chat.appendChild(this.inputArea);
    
    this.widget.appendChild(this.button);
    this.widget.appendChild(this.chat);
    
    // Add to document
    document.body.appendChild(this.widget);
    
    // Store references to elements
    this.closeButton = this.header.querySelector('.secbot-close');
    this.input = this.inputArea.querySelector('input');
    this.sendButton = this.inputArea.querySelector('button');
  }

  /**
   * Add event listeners to widget elements
   */
  addEventListeners() {
    // Toggle chat window
    this.button.addEventListener('click', () => this.toggleChat());
    this.closeButton.addEventListener('click', () => this.toggleChat(false));
    
    // Send message on button click
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Send message on Enter key
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    
    // Focus input when chat opens
    this.chat.addEventListener('transitionend', () => {
      if (this.isOpen) {
        this.input.focus();
      }
    });
  }

  /**
   * Toggle chat window visibility
   */
  toggleChat(open = null) {
    this.isOpen = open !== null ? open : !this.isOpen;
    
    if (this.isOpen) {
      this.chat.classList.add('active');
      setTimeout(() => this.input.focus(), 300);
    } else {
      this.chat.classList.remove('active');
    }
  }

  /**
   * Send user message to API
   */
  async sendMessage() {
    const message = this.input.value.trim();
    
    if (!message || this.isLoading) return;
    
    // Add user message to chat
    this.addUserMessage(message);
    
    // Clear input
    this.input.value = '';
    
    // Show loading indicator
    this.showLoading(true);
    
    try {
      // Send message to API
      const response = await fetch(this.options.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          sessionId: this.options.sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      this.addBotMessage(data.response);
      
      // Save chat history
      this.saveChatHistory();
      
    } catch (error) {
      console.error('[SecBot] Error:', error);
      this.addBotMessage('Sorry, I encountered an error. Please try again later.');
    } finally {
      // Hide loading indicator
      this.showLoading(false);
    }
  }

  /**
   * Add user message to chat
   */
  addUserMessage(text) {
    const message = {
      type: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
    
    // Save to chat history
    this.saveChatHistory();
  }

  /**
   * Add bot message to chat
   */
  addBotMessage(text) {
    const message = {
      type: 'bot',
      text,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
    
    // Save to chat history
    this.saveChatHistory();
  }

  /**
   * Render a message in the chat
   */
  renderMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = `secbot-message ${message.type}`;
    
    // Process markdown-like formatting for bot messages
    if (message.type === 'bot') {
      // Convert code blocks
      let formattedText = message.text
        .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      
      // Convert URLs to links
      formattedText = formattedText.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      
      messageEl.innerHTML = formattedText;
    } else {
      // Simple text for user messages
      messageEl.textContent = message.text;
    }
    
    this.messagesContainer.appendChild(messageEl);
  }

  /**
   * Show or hide loading indicator
   */
  showLoading(show) {
    this.isLoading = show;
    
    // Remove existing loader if any
    const existingLoader = this.messagesContainer.querySelector('.secbot-loader');
    if (existingLoader) {
      existingLoader.remove();
    }
    
    if (show) {
      // Create and add loader
      const loader = document.createElement('div');
      loader.className = 'secbot-loader';
      loader.innerHTML = '<span></span><span></span><span></span>';
      this.messagesContainer.appendChild(loader);
      this.scrollToBottom();
      
      // Disable input and button
      this.input.disabled = true;
      this.sendButton.disabled = true;
    } else {
      // Enable input and button
      this.input.disabled = false;
      this.sendButton.disabled = false;
      this.input.focus();
    }
  }

  /**
   * Scroll messages container to bottom
   */
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Generate a random session ID
   */
  generateSessionId() {
    return 'secbot_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Save chat history to localStorage
   */
  saveChatHistory() {
    try {
      // Limit history to last 50 messages
      const historyToSave = this.messages.slice(-50);
      localStorage.setItem(this.storageKey, JSON.stringify({
        sessionId: this.options.sessionId,
        messages: historyToSave
      }));
    } catch (error) {
      console.error('[SecBot] Error saving chat history:', error);
    }
  }

  /**
   * Load chat history from localStorage
   */
  loadChatHistory() {
    try {
      const savedHistory = localStorage.getItem(this.storageKey);
      
      if (savedHistory) {
        const { sessionId, messages } = JSON.parse(savedHistory);
        
        // Use saved session ID if available
        if (sessionId) {
          this.options.sessionId = sessionId;
        }
        
        // Load messages
        if (Array.isArray(messages)) {
          this.messages = messages;
          
          // Render loaded messages
          this.messagesContainer.innerHTML = '';
          messages.forEach(message => this.renderMessage(message));
          this.scrollToBottom();
        }
      }
    } catch (error) {
      console.error('[SecBot] Error loading chat history:', error);
    }
  }

  /**
   * Clear chat history
   */
  clearHistory() {
    this.messages = [];
    this.messagesContainer.innerHTML = '';
    localStorage.removeItem(this.storageKey);
    
    // Add welcome message
    this.addBotMessage(this.options.welcomeMessage);
  }
}

// Initialize the widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a page that should have the widget
  const shouldInitWidget = !window.location.pathname.includes('dashboard');
  
  if (shouldInitWidget) {
    window.secbotWidget = new SecBotWidget({
      apiUrl: 'http://localhost:3001/api/chat',
      sessionId: localStorage.getItem('secbot_session_id') || undefined
    });
  }
});