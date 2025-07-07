// Lyro AI Agent Integration
import { LYRO_CONFIG, getRandomFallbackMessage } from '../config/lyro';

export interface LyroMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface LyroConfig {
  agentId: string;
  apiKey?: string;
  baseUrl?: string;
}

class LyroAgent {
  private config: LyroConfig;
  private isInitialized = false;
  private messageHistory: LyroMessage[] = [];

  constructor(config: LyroConfig) {
    this.config = {
      baseUrl: LYRO_CONFIG.BASE_URL,
      ...config
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Lyro script dynamically
      await this.loadLyroScript();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Lyro agent:', error);
      throw error;
    }
  }

  private loadLyroScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src*="lyro"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.lyro.ai/lyro.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Lyro script'));
      document.head.appendChild(script);
    });
  }

  async sendMessage(message: string): Promise<LyroMessage> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const userMessage: LyroMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    this.messageHistory.push(userMessage);

    try {
      // Use Lyro's API to send message
      const response = await fetch(`${this.config.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          agentId: this.config.agentId,
          message: message,
          history: this.messageHistory.slice(-LYRO_CONFIG.MAX_HISTORY_LENGTH) // Send last N messages for context
        })
      });

      if (!response.ok) {
        throw new Error(`Lyro API error: ${response.status}`);
      }

      const data = await response.json();
      
      const agentMessage: LyroMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || getRandomFallbackMessage(),
        sender: 'agent',
        timestamp: new Date()
      };

      this.messageHistory.push(agentMessage);
      return agentMessage;
    } catch (error) {
      console.error('Error sending message to Lyro:', error);
      
      // Fallback response
      const fallbackMessage: LyroMessage = {
        id: (Date.now() + 1).toString(),
        text: getRandomFallbackMessage(),
        sender: 'agent',
        timestamp: new Date()
      };

      this.messageHistory.push(fallbackMessage);
      return fallbackMessage;
    }
  }

  getMessageHistory(): LyroMessage[] {
    return [...this.messageHistory];
  }

  clearHistory(): void {
    this.messageHistory = [];
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create and export a singleton instance
export const lyroAgent = new LyroAgent({
  agentId: LYRO_CONFIG.AGENT_ID,
  apiKey: LYRO_CONFIG.API_KEY
});

export default lyroAgent; 