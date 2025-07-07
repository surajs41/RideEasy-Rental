// Lyro AI Agent Configuration
export const LYRO_CONFIG = {
  // Replace these with your actual Lyro credentials
  AGENT_ID: 'your-lyro-agent-id',
  API_KEY: 'your-lyro-api-key',
  
  // Optional: Customize the agent behavior
  WELCOME_MESSAGE: 'Hello! I\'m your RideEasy assistant. How can I help you today?',
  AGENT_NAME: 'RideEasy Assistant',
  
  // API configuration
  BASE_URL: 'https://api.lyro.ai',
  TIMEOUT: 30000, // 30 seconds
  
  // Chat widget styling
  PRIMARY_COLOR: '#6366f1',
  SECONDARY_COLOR: '#4f46e5',
  
  // Features
  ENABLE_TYPING_INDICATOR: true,
  ENABLE_MESSAGE_HISTORY: true,
  MAX_HISTORY_LENGTH: 10,
  
  // Fallback responses
  FALLBACK_MESSAGES: [
    'Sorry, I\'m having trouble understanding. Could you rephrase that?',
    'I\'m not sure about that. Let me connect you with our support team.',
    'Something went wrong. Please try again or contact us directly.'
  ]
};

// Helper function to get a random fallback message
export const getRandomFallbackMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * LYRO_CONFIG.FALLBACK_MESSAGES.length);
  return LYRO_CONFIG.FALLBACK_MESSAGES[randomIndex];
}; 