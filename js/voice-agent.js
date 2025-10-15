// AI Voice Agent with Web Speech API
class AIVoiceAgent {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentVoice = null;
        this.isSupported = this.checkSupport();
        
        this.init();
    }

    init() {
        if (this.isSupported) {
            this.setupSpeechRecognition();
            this.setupSpeechSynthesis();
            this.bindEvents();
        } else {
            console.warn('Speech API not supported in this browser');
            this.showFallbackMessage();
        }
    }

    checkSupport() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-AU'; // Australian English
            
            this.recognition.onstart = () => {
                this.onListeningStart();
            };
            
            this.recognition.onresult = (event) => {
                this.onSpeechResult(event);
            };
            
            this.recognition.onerror = (event) => {
                this.onSpeechError(event);
            };
            
            this.recognition.onend = () => {
                this.onListeningEnd();
            };
        }
    }

    setupSpeechSynthesis() {
        // Wait for voices to be loaded
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.addEventListener('voiceschanged', () => {
                this.selectOptimalVoice();
            });
        } else {
            this.selectOptimalVoice();
        }
    }

    selectOptimalVoice() {
        const voices = this.synthesis.getVoices();
        
        // Prefer Australian English voices, then British, then American
        const preferredVoices = [
            'Karen (Enhanced)', // Australian
            'Karen', // Australian
            'Samantha (Enhanced)', // American premium
            'Samantha', // American
            'Daniel (Enhanced)', // British
            'Daniel', // British
            'Alex' // macOS default
        ];
        
        for (const preferredName of preferredVoices) {
            const voice = voices.find(v => v.name.includes(preferredName));
            if (voice) {
                this.currentVoice = voice;
                break;
            }
        }
        
        // Fallback to first English voice
        if (!this.currentVoice) {
            this.currentVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        }
    }

    bindEvents() {
        // Voice button in chat
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        }

        // Voice button in hero section
        document.addEventListener('click', (e) => {
            if (e.target.closest('.voice-card .btn-glass')) {
                this.toggleVoiceAgent();
            }
        });
    }

    toggleVoiceRecognition() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    toggleVoiceAgent() {
        // Open chat widget if not already open
        if (window.aiChat && !window.aiChat.isOpen) {
            window.aiChat.openChat();
        }
        
        // Start voice recognition
        setTimeout(() => {
            this.toggleVoiceRecognition();
        }, 300);
    }

    startListening() {
        if (!this.isSupported || !this.recognition) {
            this.showUnsupportedMessage();
            return;
        }

        if (this.isSpeaking) {
            this.synthesis.cancel(); // Stop any current speech
            this.isSpeaking = false;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Speech recognition error:', error);
            this.showErrorMessage('Unable to start voice recognition. Please check your microphone permissions.');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    onListeningStart() {
        this.isListening = true;
        this.updateVoiceUI(true);
        this.updateStatusText('Listening... Speak now');
    }

    onListeningEnd() {
        this.isListening = false;
        this.updateVoiceUI(false);
        this.updateStatusText('Click to speak');
    }

    onSpeechResult(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Update UI with interim results
        if (interimTranscript) {
            this.updateStatusText(`"${interimTranscript}"`);
        }

        // Process final result
        if (finalTranscript) {
            this.processSpeechInput(finalTranscript);
        }
    }

    onSpeechError(event) {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Voice recognition error. ';
        
        switch (event.error) {
            case 'no-speech':
                errorMessage += 'No speech detected. Try again.';
                break;
            case 'audio-capture':
                errorMessage += 'Microphone not accessible.';
                break;
            case 'not-allowed':
                errorMessage += 'Microphone permission denied.';
                break;
            case 'network':
                errorMessage += 'Network error occurred.';
                break;
            default:
                errorMessage += 'Please try again.';
        }
        
        this.showErrorMessage(errorMessage);
        this.onListeningEnd();
    }

    processSpeechInput(transcript) {
        const cleanedInput = transcript.trim();
        
        if (cleanedInput) {
            // Add the spoken message to chat
            if (window.aiChat) {
                window.aiChat.addMessage(cleanedInput, 'user');
                
                // Show typing indicator
                window.aiChat.showTypingIndicator();
                
                // Generate AI response
                setTimeout(() => {
                    window.aiChat.hideTypingIndicator();
                    const response = window.aiChat.generateAIResponse(cleanedInput);
                    window.aiChat.addMessage(response, 'bot');
                    
                    // Speak the response
                    this.speak(response);
                    
                    // Extract lead intent
                    window.aiChat.extractLeadIntent(cleanedInput);
                }, 1000 + Math.random() * 1500);
            }
            
            this.updateStatusText('Processing...');
        }
    }

    speak(text) {
        if (!this.synthesis || this.isSpeaking) return;

        // Clean up text for better speech
        const cleanText = this.prepareTextForSpeech(text);
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Configure speech parameters for premium experience
        utterance.voice = this.currentVoice;
        utterance.rate = 0.9; // Slightly slower for luxury feel
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateStatusText('Speaking...');
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateStatusText('Click to speak');
        };
        
        utterance.onerror = () => {
            this.isSpeaking = false;
            this.updateStatusText('Speech error occurred');
        };
        
        this.synthesis.speak(utterance);
    }

    prepareTextForSpeech(text) {
        return text
            // Replace currency formatting
            .replace(/\$(\d+),(\d+),(\d+)/g, '$1 million, $2 thousand, $3 dollars')
            .replace(/\$(\d+),(\d+)/g, '$1 thousand, $2 hundred dollars')
            .replace(/\$(\d+)M/g, '$1 million dollars')
            // Replace abbreviations
            .replace(/\bNSW\b/g, 'New South Wales')
            .replace(/\bCBD\b/g, 'Central Business District')
            .replace(/\bAI\b/g, 'A.I.')
            .replace(/\bROI\b/g, 'R.O.I.')
            // Replace common real estate terms
            .replace(/\bsqft\b/g, 'square feet')
            .replace(/\bsqm\b/g, 'square metres')
            .replace(/\bbeds?\b/g, 'bedrooms')
            .replace(/\bbaths?\b/g, 'bathrooms')
            // Clean up formatting
            .replace(/["""]/g, '"')
            .replace(/'/g, "'")
            .trim();
    }

    updateVoiceUI(isListening) {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceControls = document.getElementById('voiceControls');
        
        if (voiceBtn) {
            if (isListening) {
                voiceBtn.classList.add('listening');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            } else {
                voiceBtn.classList.remove('listening');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        }
        
        if (voiceControls) {
            if (isListening) {
                voiceControls.classList.add('listening');
            } else {
                voiceControls.classList.remove('listening');
            }
        }
    }

    updateStatusText(text) {
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = text;
        }
    }

    showUnsupportedMessage() {
        this.updateStatusText('Voice not supported in this browser');
        
        if (window.aiChat) {
            const fallbackMessage = "Voice recognition isn't supported in your current browser. For the best voice experience, please use Chrome, Safari, or Edge. You can continue using text chat!";
            window.aiChat.addMessage(fallbackMessage, 'bot');
        }
    }

    showErrorMessage(message) {
        this.updateStatusText('Voice error occurred');
        
        if (window.aiChat) {
            window.aiChat.addMessage(message, 'bot');
        }
    }

    showFallbackMessage() {
        // Update voice card in hero section to show text-only option
        const voiceCard = document.querySelector('.voice-card');
        if (voiceCard) {
            const button = voiceCard.querySelector('.btn-glass');
            if (button) {
                button.innerHTML = '<i class="fas fa-comments"></i> Start Text Chat';
                button.onclick = () => {
                    if (window.aiChat) {
                        window.aiChat.openChat();
                    }
                };
            }
        }
    }

    // Utility method to check microphone permissions
    async checkMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream
            return true;
        } catch (error) {
            console.error('Microphone permission error:', error);
            return false;
        }
    }

    // Method to request microphone permission
    async requestMicrophonePermission() {
        const hasPermission = await this.checkMicrophonePermission();
        if (!hasPermission) {
            this.showErrorMessage('Microphone access is required for voice chat. Please grant permission and try again.');
        }
        return hasPermission;
    }
}

// Global functions for HTML onclick handlers
function toggleVoice() {
    if (window.voiceAgent) {
        window.voiceAgent.toggleVoiceRecognition();
    }
}

function toggleVoiceAgent() {
    if (window.voiceAgent) {
        window.voiceAgent.toggleVoiceAgent();
    }
}

// Initialize Voice Agent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.voiceAgent = new AIVoiceAgent();
});

// Handle browser tab visibility changes (pause voice when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && window.voiceAgent) {
        if (window.voiceAgent.isListening) {
            window.voiceAgent.stopListening();
        }
        if (window.voiceAgent.isSpeaking) {
            window.speechSynthesis.cancel();
            window.voiceAgent.isSpeaking = false;
        }
    }
});

// Clean up speech synthesis on page unload
window.addEventListener('beforeunload', function() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});