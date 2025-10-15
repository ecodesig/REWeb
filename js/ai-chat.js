// AI Chat Concierge System
class AIChatConcierge {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversationContext = {};
        this.leadProfile = JSON.parse(localStorage.getItem('leadProfile')) || {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialMessage();
        this.updateChatBadge();
    }

    bindEvents() {
        // Chat toggle
        const chatToggle = document.getElementById('chatToggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }

        // Chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Send button
        const sendBtn = document.querySelector('.send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Close button
        const closeBtn = document.querySelector('.chat-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChat());
        }

        // Quick prompts
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('prompt-btn')) {
                const message = e.target.textContent;
                this.sendQuickPrompt(message);
            }
        });
    }

    loadInitialMessage() {
        const welcomeMessage = this.getRandomResponse(aiResponses.greetings);
        this.addMessage(welcomeMessage, 'bot');
    }

    toggleChat() {
        const chatWidget = document.getElementById('chatWidget');
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWidget = document.getElementById('chatWidget');
        const chatToggle = document.getElementById('chatToggle');
        
        if (chatWidget && chatToggle) {
            chatWidget.classList.add('active');
            this.isOpen = true;
            
            // Hide notification badge
            const badge = document.getElementById('chatBadge');
            if (badge) {
                badge.style.display = 'none';
            }
            
            // Focus input
            setTimeout(() => {
                const input = document.getElementById('chatInput');
                if (input) input.focus();
            }, 300);
            
            // Add contextual suggestions based on current page
            this.addContextualSuggestions();
        }
    }

    closeChat() {
        const chatWidget = document.getElementById('chatWidget');
        if (chatWidget) {
            chatWidget.classList.remove('active');
            this.isOpen = false;
        }
    }

    addContextualSuggestions() {
        const currentPage = window.location.pathname;
        let suggestions = [];

        if (currentPage.includes('listing-details')) {
            suggestions = [
                "Schedule a tour of this property",
                "Compare mortgage options",
                "Tell me about the neighborhood",
                "What are similar properties?"
            ];
        } else if (currentPage.includes('listings')) {
            suggestions = [
                "Show me waterfront properties",
                "Find homes under $15M",
                "Properties with pools",
                "Best family neighborhoods"
            ];
        } else {
            suggestions = [
                "Find oceanfront homes under $20M",
                "Schedule a property tour",
                "Explain HOA fees",
                "Best neighborhoods for families"
            ];
        }

        // Update quick prompts with contextual suggestions
        setTimeout(() => {
            this.updateQuickPrompts(suggestions);
        }, 500);
    }

    updateQuickPrompts(suggestions) {
        const quickPrompts = document.querySelector('.quick-prompts');
        if (quickPrompts && suggestions.length > 0) {
            quickPrompts.innerHTML = suggestions.map(suggestion => 
                `<button class="prompt-btn" onclick="sendQuickPrompt('${suggestion}')">${suggestion}</button>`
            ).join('');
        }
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input?.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addMessage(response, 'bot');
            this.extractLeadIntent(message);
        }, 1000 + Math.random() * 2000); // 1-3 second delay
    }

    sendQuickPrompt(message) {
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response for quick prompt
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addMessage(response, 'bot');
            this.extractLeadIntent(message);
        }, 800 + Math.random() * 1200);
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        // Remove quick prompts when first user message is sent
        if (sender === 'user' && this.messages.length === 0) {
            const quickPrompts = messagesContainer.querySelector('.quick-prompts');
            if (quickPrompts) {
                quickPrompts.style.display = 'none';
            }
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ content, sender, timestamp: Date.now() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for specific keywords and patterns
        if (this.containsAny(message, ['waterfront', 'harbour', 'harbor', 'beach', 'ocean'])) {
            return aiResponses.propertyQuestions.waterfront;
        }
        
        if (this.containsAny(message, ['price', 'cost', 'budget', '$', 'million', 'affordable'])) {
            return aiResponses.propertyQuestions.price;
        }
        
        if (this.containsAny(message, ['neighborhood', 'area', 'suburb', 'location', 'where'])) {
            return aiResponses.propertyQuestions.neighborhoods;
        }
        
        if (this.containsAny(message, ['features', 'amenities', 'pool', 'gym', 'wine cellar', 'tennis'])) {
            return aiResponses.propertyQuestions.features;
        }
        
        if (this.containsAny(message, ['investment', 'market', 'appreciation', 'roi', 'return'])) {
            return aiResponses.propertyQuestions.investment;
        }
        
        if (this.containsAny(message, ['tour', 'visit', 'schedule', 'appointment', 'viewing'])) {
            return this.getRandomResponse(aiResponses.scheduling);
        }
        
        if (this.containsAny(message, ['mortgage', 'loan', 'financing', 'payment', 'calculate'])) {
            return this.getRandomResponse(aiResponses.mortgage);
        }
        
        if (this.containsAny(message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
            return this.getRandomResponse(aiResponses.greetings);
        }
        
        // Property-specific responses
        if (this.containsAny(message, ['point piper', 'piper'])) {
            return "Point Piper is Sydney's most prestigious waterfront address! We have exceptional mansions there starting from $25M, featuring private jetties and panoramic harbour views. Would you like to see our current Point Piper listings?";
        }
        
        if (this.containsAny(message, ['double bay'])) {
            return "Double Bay offers the perfect blend of luxury living and urban convenience! Known for high-end shopping and waterfront dining, our properties there range from $12M to $25M. The area is famous for its designer boutiques and marina access.";
        }
        
        if (this.containsAny(message, ['mosman'])) {
            return "Mosman is perfect for luxury family living! This harbour suburb offers beautiful beaches, excellent schools, and properties ranging from $8M to $18M. It's particularly popular with families seeking premium amenities and outdoor lifestyle.";
        }
        
        // Fallback response
        return this.getRandomResponse(aiResponses.fallback);
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return Array.isArray(responses) 
            ? responses[Math.floor(Math.random() * responses.length)]
            : responses;
    }

    extractLeadIntent(message) {
        const message_lower = message.toLowerCase();
        
        // Extract budget information
        const budgetMatch = message.match(/\$?(\d+(?:\.\d+)?)\s*(?:m|million)/i);
        if (budgetMatch) {
            this.leadProfile.budget = parseFloat(budgetMatch[1]) * 1000000;
        }
        
        // Extract bedroom requirements
        const bedroomMatch = message.match(/(\d+)\s*(?:bed|bedroom)/i);
        if (bedroomMatch) {
            this.leadProfile.bedrooms = parseInt(bedroomMatch[1]);
        }
        
        // Extract neighborhood preferences
        const neighborhoods = ['point piper', 'double bay', 'mosman', 'vaucluse', 'rose bay', 'bellevue hill'];
        neighborhoods.forEach(neighborhood => {
            if (message_lower.includes(neighborhood)) {
                if (!this.leadProfile.preferredNeighborhoods) {
                    this.leadProfile.preferredNeighborhoods = [];
                }
                if (!this.leadProfile.preferredNeighborhoods.includes(neighborhood)) {
                    this.leadProfile.preferredNeighborhoods.push(neighborhood);
                }
            }
        });
        
        // Extract property type preferences
        const propertyTypes = ['house', 'penthouse', 'apartment', 'mansion'];
        propertyTypes.forEach(type => {
            if (message_lower.includes(type)) {
                this.leadProfile.propertyType = type;
            }
        });
        
        // Extract feature preferences
        const features = ['pool', 'waterfront', 'harbour view', 'tennis court', 'wine cellar', 'gym'];
        features.forEach(feature => {
            if (message_lower.includes(feature.toLowerCase())) {
                if (!this.leadProfile.desiredFeatures) {
                    this.leadProfile.desiredFeatures = [];
                }
                if (!this.leadProfile.desiredFeatures.includes(feature)) {
                    this.leadProfile.desiredFeatures.push(feature);
                }
            }
        });
        
        // Save lead profile
        this.leadProfile.lastUpdated = Date.now();
        localStorage.setItem('leadProfile', JSON.stringify(this.leadProfile));
        
        // Log for development (remove in production)
        console.log('Updated lead profile:', this.leadProfile);
    }

    updateChatBadge() {
        const badge = document.getElementById('chatBadge');
        if (badge && !this.isOpen) {
            badge.style.display = 'flex';
        }
    }

    // Public method to send leads to API (placeholder for real implementation)
    async submitLead(leadData) {
        try {
            // TODO: Replace with real API endpoint
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...this.leadProfile,
                    ...leadData,
                    source: 'ai_chat',
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                console.log('Lead submitted successfully');
                // Clear local storage after successful submission
                localStorage.removeItem('leadProfile');
                this.leadProfile = {};
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
        }
    }
}

// Global functions for HTML onclick handlers
function openAIChat() {
    if (window.aiChat) {
        window.aiChat.openChat();
    }
}

function toggleChatWidget() {
    if (window.aiChat) {
        window.aiChat.toggleChat();
    }
}

function closeChatWidget() {
    if (window.aiChat) {
        window.aiChat.closeChat();
    }
}

function sendQuickPrompt(message) {
    if (window.aiChat) {
        window.aiChat.sendQuickPrompt(message);
    }
}

function sendMessage() {
    if (window.aiChat) {
        window.aiChat.sendMessage();
    }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiChat = new AIChatConcierge();
});

// Placeholder function for future LLM API integration
async function sendMessageToAI(userMessage) {
    // TODO: Replace with real LLM API call
    // Example structure for future implementation:
    /*
    try {
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                message: userMessage,
                context: window.aiChat.conversationContext,
                leadProfile: window.aiChat.leadProfile
            })
        });
        
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error calling AI API:', error);
        return "I apologize, but I'm having trouble connecting right now. Please try again or contact our team directly.";
    }
    */
    
    // For now, return mock response
    return window.aiChat.generateAIResponse(userMessage);
}